// Initialize Fabric.js canvas
const canvas = new fabric.Canvas('tshirtCanvas', {
    preserveObjectStacking: true
  });
  
  // Load T-shirt mockup as background
  fabric.Image.fromURL('assets/mockup-t.png', (img) => {
    img.scaleToWidth(canvas.width);
    img.scaleToHeight(canvas.height);
    img.selectable = false;     // make mockup unselectable
    img.evented = false;        // disable events
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  });
  
  // Handle image upload
  document.getElementById('fileUpload').onchange = function (e) {
    const reader = new FileReader();
    reader.onload = function (f) {
      fabric.Image.fromURL(f.target.result, (img) => {
        img.scaleToWidth(250);       // initial size
        img.top = 200;               // position (adjust if needed)
        img.left = 170;
        img.hasRotatingPoint = true;
        img.cornerStyle = 'circle';
        img.transparentCorners = false;
  
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  
  // Optional: limit dragging inside canvas
  canvas.on('object:moving', function (e) {
    const obj = e.target;
    obj.setCoords();
    const bounding = obj.getBoundingRect(true);
    if (bounding.left < 0) obj.left -= bounding.left;
    if (bounding.top < 0) obj.top -= bounding.top;
    if (bounding.left + bounding.width > canvas.width) {
      obj.left -= bounding.left + bounding.width - canvas.width;
    }
    if (bounding.top + bounding.height > canvas.height) {
      obj.top -= bounding.top + bounding.height - canvas.height;
    }
  });
  