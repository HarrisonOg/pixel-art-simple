# Pixel Art Editor

A lightweight, browser-based pixel art editor built with vanilla HTML, CSS, and JavaScript. Create pixel art on customizable grids and export your creations as PNG images.

## Features

- **Customizable Grid Sizes**: Choose from 4x4 to 32x32 pixel grids
- **Color Tools**: Native HTML5 color picker with 12 preset color swatches
- **Drawing Tools**:
  - Draw mode for painting pixels
  - Eraser mode for clearing pixels
  - Click or drag to paint continuously
- **Touch Support**: Full touch and mouse support for desktop and mobile devices
- **Background Options**: Choose between transparent or white backgrounds for exports
- **Configurable Output**: Set custom output dimensions (16px - 1024px) for exported images
- **PNG Export**: Download your artwork as a PNG file with timestamp
- **Clear Canvas**: Reset the entire grid with one click
- **Responsive Design**: Works seamlessly across different screen sizes

## Usage

1. **Select a grid size** from the dropdown (4x4 to 32x32)
2. **Pick a color** using the color picker or preset palette
3. **Draw** by clicking or dragging on the grid
4. **Switch to eraser** to remove pixels
5. **Adjust output size** before downloading (defaults to 512x512px)
6. **Choose background** (transparent or white) for the export
7. **Download** your creation as a PNG file

## Technical Details

- **Zero dependencies**: Pure vanilla JavaScript
- **No build step**: Works directly in any modern browser
- **Lightweight**: ~10KB total file size
- **Fast loading**: Instant page load and offline-capable once cached
- **GitHub Pages ready**: Can be deployed as a static site

## Local Development

Simply open `index.html` in a web browser. No build process or server required.

## Deployment

This project is configured for deployment to GitHub Pages. Push to the main branch and enable GitHub Pages in repository settings.

## Browser Support

Works on all modern browsers that support:
- HTML5 Canvas
- CSS Grid
- ES6 JavaScript
- Touch events (for mobile)

## License

MIT
