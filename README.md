# ColorMagic Palette Search

A simple and functional web application that allows users to search for color palettes using the ColorMagic API. The application displays color palettes in an intuitive card-based layout with responsive design for all screen sizes.

## Features

- **Search Functionality**: Search for color palettes by keywords, tags, or color names
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling for API failures, invalid inputs, and empty results
- **Loading States**: Visual feedback with loading spinners and disabled buttons during API requests
- **Input Validation**: Validates search queries before making API requests
- **Card Layout**: Beautiful card-based display of color palettes with hover effects
- **Color Swatches**: Interactive color swatches that show individual colors in each palette

## API Information

### Base URL
```
https://colormagic.app/api/palette/search
```

### Endpoints

1. **Search Color Palettes**
   - **Endpoint**: `/api/palette/search`
   - **Method**: GET
   - **Parameters**: 
     - `q` (query parameter) - Search query for tags, text, etc.
   - **Example**: `https://colormagic.app/api/palette/search?q=green`

### Required Parameters

- `q` (query parameter): The search query string (required)
  - Minimum length: 2 characters
  - Maximum length: 50 characters
  - Automatically trimmed of whitespace

### Authentication

**None** - This API does not require authentication or API keys.

### Sample JSON Response

```json
[
  {
    "id": "671fd5edab6cc866507fe7cf",
    "colors": [
      "#44562f",
      "#83934d",
      "#b7c88d",
      "#e9dfb4",
      "#efbfb3"
    ],
    "tags": [
      "earthy",
      "olive",
      "green",
      "khaki",
      "beige",
      "pastel",
      "soft",
      "muted",
      "neutral",
      "warm"
    ],
    "text": "Florest Moth",
    "likesCount": 454,
    "normalizedHash": "a2ff2c8e68ef3cf69ee27ded00c4ad5e7d5deed82b05688f3976801b960482ea",
    "createdAt": "2024-10-28T18:20:29.406Z"
  }
]
```

## File Structure

```
color_magic/
├── index.html      # Main HTML file
├── style.css       # Stylesheet with responsive design
├── script.js       # JavaScript functionality
└── README.md       # Project documentation
```

## How to Run

1. **Clone or download** the project files
2. **Open** `index.html` in a web browser
   - You can simply double-click the file
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
3. **Navigate** to `http://localhost:8000/color_magic` (if using a server)
   - Or open the file directly from your file system

## Usage

1. Enter a search query in the search box (e.g., "green", "blue", "pastel", "vintage")
2. Click the "Search" button or press Enter
3. View the color palettes displayed in cards
4. Each card shows:
   - Color swatches for all colors in the palette
   - Palette name
   - Tags associated with the palette
   - Number of likes

## Error Handling

The application handles the following error scenarios:

- **Empty Input**: Shows error message when search field is empty
- **Invalid Input**: Validates minimum (2 characters) and maximum (50 characters) length
- **API Failure**: Displays error message when API request fails
- **No Results**: Shows message when no palettes match the search query
- **Network Errors**: Handles network connectivity issues gracefully

## Input Validation

- Checks for empty fields
- Validates minimum and maximum character length
- Automatically trims whitespace
- Disables search button during loading to prevent double submissions

## Loading State

The application displays:
- Loading spinner animation
- "Loading..." text
- Disabled search button during API requests

## Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: Full-width grid layout with multiple columns
- **Tablet**: Adjusted grid columns and spacing
- **Mobile**: Single column layout with optimized touch targets
- **Small Mobile**: Compact layout for screens under 360px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Async/await for API calls, DOM manipulation
- **Fetch API**: For making HTTP requests

## Code Organization

- **Functions Only**: No constructors, classes, or initialization functions
- **Separated Concerns**: API functions, DOM functions, and utility functions are clearly separated
- **No Duplication**: Reusable functions prevent code duplication
- **Comments**: Key functions are documented with comments

## CSS Features

- Card layout for palette display
- Grid gallery for responsive results
- Hover effects on cards and color swatches
- Custom color theme matching the application
- Responsive images and layouts
- Smooth transitions and animations

## Credits

- **API Source**: [ColorMagic API](https://colormagic.app)
- **API Documentation**: Available at the ColorMagic website

## License

This project is for educational purposes. The ColorMagic API is provided by colormagic.app.

## Notes

- The application uses only functions (no classes or constructors)
- All CSS and JavaScript are in separate files (no inline code)
- Unique class names prefixed with `colormagic-` to prevent conflicts
- Proper indentation and formatting throughout
- Mobile-first responsive design approach

