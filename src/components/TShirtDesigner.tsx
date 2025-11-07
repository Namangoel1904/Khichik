import { useEffect, useRef, useState } from 'react';

interface TShirtDesignerProps {
  designImage?: string;
  shirtColor: string;
  isProcessing?: boolean;
}

export const TShirtDesigner = ({ designImage, shirtColor, isProcessing }: TShirtDesignerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [designPosition, setDesignPosition] = useState({ x: 125, y: 200 });
  const [designScale, setDesignScale] = useState(1);
  const [designRotation, setDesignRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [designBaseSize, setDesignBaseSize] = useState<{ width: number; height: number }>({ width: 150, height: 150 });

  // Get mockup image path based on shirt color
  const getMockupPath = (color: string) => {
    switch (color.toLowerCase()) {
      case '#0b0b0f':
        return '/mock-tBL.jpg';
      case '#e6e6eb':
        return '/mockup-t.png';
      case '#1e2a44':
        return '/mock-tB.jpg';
      case '#6d1b1b':
        return '/mock-tR.jpg';
      default:
        return '/mockup-t.png';
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 500;

    // Load T-shirt mockup based on color
    const mockupImg = new Image();
    mockupImg.onload = () => {
      // Draw T-shirt mockup
      ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);
      setIsCanvasReady(true);
    };
    mockupImg.onerror = () => {
      console.error('Failed to load mockup image');
      // Draw fallback background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setIsCanvasReady(true);
    };
    mockupImg.src = getMockupPath(shirtColor);
  }, [shirtColor]);

  // Draw design on canvas
  useEffect(() => {
    if (!isCanvasReady || !designImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw T-shirt mockup
    const mockupImg = new Image();
    mockupImg.onload = () => {
      ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

      // Draw design
      const designImg = new Image();
      designImg.onload = () => {
        ctx.save();
        // Compute fitted base size preserving aspect ratio within a max box
        const maxBoxWidth = 200;
        const maxBoxHeight = 200;
        const fitScale = Math.min(
          maxBoxWidth / designImg.width,
          maxBoxHeight / designImg.height,
          1
        );
        const fittedWidth = Math.max(1, Math.round(designImg.width * fitScale));
        const fittedHeight = Math.max(1, Math.round(designImg.height * fitScale));
        // Store for hit testing and constraints
        if (
          fittedWidth !== designBaseSize.width ||
          fittedHeight !== designBaseSize.height
        ) {
          setDesignBaseSize({ width: fittedWidth, height: fittedHeight });
        }

        // Move to design center
        const halfW = (fittedWidth * designScale) / 2;
        const halfH = (fittedHeight * designScale) / 2;
        ctx.translate(designPosition.x + halfW, designPosition.y + halfH);

        // Apply rotation
        ctx.rotate((designRotation * Math.PI) / 180);
        
        // Apply scale
        ctx.scale(designScale, designScale);
        
        // Draw design centered with preserved aspect ratio
        ctx.drawImage(designImg, -fittedWidth / 2, -fittedHeight / 2, fittedWidth, fittedHeight);
        
        ctx.restore();
      };
      designImg.src = designImage;
    };
    mockupImg.src = getMockupPath(shirtColor);
  }, [designImage, designPosition, designScale, designRotation, isCanvasReady, shirtColor, designBaseSize.width, designBaseSize.height]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!designImage) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is within design bounds
    const designBounds = {
      left: designPosition.x,
      top: designPosition.y,
      right: designPosition.x + designBaseSize.width * designScale,
      bottom: designPosition.y + designBaseSize.height * designScale
    };

    if (x >= designBounds.left && x <= designBounds.right && 
        y >= designBounds.top && y <= designBounds.bottom) {
      setIsDragging(true);
      setDragStart({ x: x - designPosition.x, y: y - designPosition.y });
    }
  };

  // Touch event handlers (mobile)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!designImage) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const designBounds = {
      left: designPosition.x,
      top: designPosition.y,
      right: designPosition.x + designBaseSize.width * designScale,
      bottom: designPosition.y + designBaseSize.height * designScale
    };
    if (x >= designBounds.left && x <= designBounds.right && 
        y >= designBounds.top && y <= designBounds.bottom) {
      setIsDragging(true);
      setDragStart({ x: x - designPosition.x, y: y - designPosition.y });
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !designImage) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left - dragStart.x;
    const y = touch.clientY - rect.top - dragStart.y;
    const maxX = 400 - designBaseSize.width * designScale;
    const maxY = 500 - designBaseSize.height * designScale;
    setDesignPosition({
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    });
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !designImage) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - dragStart.x;
    const y = e.clientY - rect.top - dragStart.y;

    // Constrain to canvas bounds
    const maxX = 400 - designBaseSize.width * designScale;
    const maxY = 500 - designBaseSize.height * designScale;

    setDesignPosition({
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPosition = () => {
    setDesignPosition({ x: 125, y: 200 });
    setDesignScale(1);
    setDesignRotation(0);
  };

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto border border-border/50 rounded-lg shadow-card cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ backgroundColor: '#ffffff' }}
      />
      
      {/* Loading overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Processing design...</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isCanvasReady && !isProcessing && designImage && (
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-md px-3 py-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Drag to move design</span>
          </div>
        </div>
      )}

      {/* Controls */}
      {designImage && isCanvasReady && !isProcessing && (
        <div className="absolute bottom-2 left-2 right-2 flex gap-2">
          <button
            onClick={() => setDesignScale(Math.max(0.5, designScale - 0.1))}
            className="bg-background/90 backdrop-blur-sm text-primary px-2 py-1 rounded text-xs hover:bg-background transition-colors"
          >
            -
          </button>
          <button
            onClick={() => setDesignScale(Math.min(2, designScale + 0.1))}
            className="bg-background/90 backdrop-blur-sm text-primary px-2 py-1 rounded text-xs hover:bg-background transition-colors"
          >
            +
          </button>
          <button
            onClick={() => setDesignRotation(designRotation - 15)}
            className="bg-background/90 backdrop-blur-sm text-primary px-2 py-1 rounded text-xs hover:bg-background transition-colors"
          >
            ↺
          </button>
          <button
            onClick={() => setDesignRotation(designRotation + 15)}
            className="bg-background/90 backdrop-blur-sm text-primary px-2 py-1 rounded text-xs hover:bg-background transition-colors"
          >
            ↻
          </button>
          <button
            onClick={resetPosition}
            className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 transition-colors ml-auto"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};