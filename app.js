// Application State
const state = {
    gridSize: 16,
    currentColor: '#000000',
    currentTool: 'draw',
    isDrawing: false,
    pixels: [],
    backgroundColor: 'transparent',
    outputSize: 512
};

// Preset color palette
const presetColors = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFC0CB', // Pink
    '#A52A2A'  // Brown
];

// Initialize the application
function init() {
    initializeGrid(state.gridSize);
    setupColorPalette();
    setupEventListeners();

    // Set initial min constraint for output size
    document.getElementById('output-size').min = state.gridSize;
}

// Initialize grid with given size
function initializeGrid(size) {
    state.gridSize = size;
    state.pixels = Array(size).fill(null).map(() => Array(size).fill(null));
    renderGrid();
}

// Render the pixel grid
function renderGrid() {
    const gridElement = document.getElementById('pixel-grid');
    gridElement.innerHTML = '';

    // Set CSS grid columns dynamically
    gridElement.style.gridTemplateColumns = `repeat(${state.gridSize}, 1fr)`;

    // Calculate pixel size based on grid size for responsive sizing
    const baseSize = Math.max(280, Math.min(500, 600 - state.gridSize * 5));
    const pixelSize = baseSize / state.gridSize;
    gridElement.style.width = `${baseSize}px`;
    gridElement.style.height = `${baseSize}px`;

    // Create all pixel cells
    for (let row = 0; row < state.gridSize; row++) {
        for (let col = 0; col < state.gridSize; col++) {
            const cell = createPixelCell(row, col);
            gridElement.appendChild(cell);
        }
    }
}

// Create individual pixel cell
function createPixelCell(row, col) {
    const div = document.createElement('div');
    div.className = 'pixel';
    div.dataset.row = row;
    div.dataset.col = col;

    // Apply saved color if exists
    if (state.pixels[row][col]) {
        div.style.backgroundColor = state.pixels[row][col];
    }

    // Mouse events
    div.addEventListener('mousedown', handlePixelInteraction);
    div.addEventListener('mouseenter', handlePixelDrag);

    // Touch events
    div.addEventListener('touchstart', handleTouchStart);

    return div;
}

// Handle pixel click
function handlePixelInteraction(event) {
    event.preventDefault();
    state.isDrawing = true;
    paintPixel(event.target);
}

// Handle drag drawing
function handlePixelDrag(event) {
    if (state.isDrawing) {
        paintPixel(event.target);
    }
}

// Paint a pixel
function paintPixel(element) {
    if (!element.classList.contains('pixel')) return;

    const row = parseInt(element.dataset.row);
    const col = parseInt(element.dataset.col);

    if (state.currentTool === 'draw') {
        element.style.backgroundColor = state.currentColor;
        state.pixels[row][col] = state.currentColor;
    } else if (state.currentTool === 'erase') {
        element.style.backgroundColor = '';
        state.pixels[row][col] = null;
    }
}

// Handle touch start
function handleTouchStart(event) {
    event.preventDefault();
    state.isDrawing = true;
    paintPixel(event.target);
}

// Handle touch move
function handleTouchMove(event) {
    event.preventDefault();

    if (!state.isDrawing) return;

    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.classList.contains('pixel')) {
        paintPixel(element);
    }
}

// Setup color palette
function setupColorPalette() {
    const paletteElement = document.getElementById('color-palette');

    presetColors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.dataset.color = color;

        swatch.addEventListener('click', () => {
            state.currentColor = color;
            document.getElementById('color-picker').value = color;
            updateColorSwatchSelection();
        });

        paletteElement.appendChild(swatch);
    });

    updateColorSwatchSelection();
}

// Update color swatch selection visual
function updateColorSwatchSelection() {
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
        if (swatch.dataset.color.toLowerCase() === state.currentColor.toLowerCase()) {
            swatch.classList.add('active');
        } else {
            swatch.classList.remove('active');
        }
    });
}

// Handle grid size change
function handleGridSizeChange(newSize) {
    const hasContent = state.pixels.some(row => row.some(cell => cell !== null));

    if (hasContent) {
        const confirmed = confirm('Changing grid size will clear your artwork. Continue?');
        if (!confirmed) {
            document.getElementById('grid-size').value = state.gridSize;
            return;
        }
    }

    initializeGrid(newSize);

    // Update output size constraints based on new grid size
    const outputSizeInput = document.getElementById('output-size');
    outputSizeInput.min = newSize;

    // If current output size is less than new minimum, adjust it
    if (state.outputSize < newSize) {
        state.outputSize = newSize;
        outputSizeInput.value = newSize;
    }
}

// Download as PNG
function downloadAsPNG() {
    const canvas = document.createElement('canvas');

    // Use the user-specified output size
    canvas.width = state.outputSize;
    canvas.height = state.outputSize;

    // Calculate how many pixels each grid cell should be
    const pixelSize = state.outputSize / state.gridSize;

    const ctx = canvas.getContext('2d');

    // Fill background if white is selected
    if (state.backgroundColor === 'white') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Otherwise transparent background (default canvas behavior)

    // Draw each pixel (only non-null pixels)
    for (let row = 0; row < state.gridSize; row++) {
        for (let col = 0; col < state.gridSize; col++) {
            if (state.pixels[row][col]) {
                ctx.fillStyle = state.pixels[row][col];
                ctx.fillRect(
                    col * pixelSize,
                    row * pixelSize,
                    pixelSize,
                    pixelSize
                );
            }
        }
    }

    // Trigger download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `pixel-art-${state.outputSize}x${state.outputSize}-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Setup all event listeners
function setupEventListeners() {
    // Grid size selector
    document.getElementById('grid-size').addEventListener('change', (e) => {
        handleGridSizeChange(parseInt(e.target.value));
    });

    // Background selector
    document.querySelectorAll('input[name="background"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.backgroundColor = e.target.value;
        });
    });

    // Output size selector
    const outputSizeInput = document.getElementById('output-size');
    outputSizeInput.addEventListener('change', (e) => {
        let size = parseInt(e.target.value);

        // Enforce constraints
        const minSize = state.gridSize;
        const maxSize = 1024;

        if (size < minSize) {
            size = minSize;
            e.target.value = minSize;
        } else if (size > maxSize) {
            size = maxSize;
            e.target.value = maxSize;
        }

        state.outputSize = size;
    });

    // Color picker
    document.getElementById('color-picker').addEventListener('input', (e) => {
        state.currentColor = e.target.value;
        updateColorSwatchSelection();
    });

    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tool = e.target.dataset.tool;
            state.currentTool = tool;

            // Update button active states
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', () => {
        const confirmed = confirm('Clear the entire canvas?');
        if (confirmed) {
            initializeGrid(state.gridSize);
        }
    });

    // Download button
    document.getElementById('download-btn').addEventListener('click', downloadAsPNG);

    // Global mouse/touch events
    document.addEventListener('mouseup', () => {
        state.isDrawing = false;
    });

    document.addEventListener('mouseleave', () => {
        state.isDrawing = false;
    });

    document.addEventListener('touchend', () => {
        state.isDrawing = false;
    });

    document.addEventListener('touchmove', handleTouchMove);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
