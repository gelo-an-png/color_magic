const COLORMAGIC_API_BASE_URL = 'https://colormagic.app/api/palette/search';
let colormagicAllPalettes = [];

// yung function nato is para sa pag vavalidate ng input doon sa input field , chinecheck lang if tama ba yung nilagay ni user sa input field
function colormagicValidateInput(searchQuery) {
    const trimmed = searchQuery.trim();
    if (trimmed === '') {
        return { valid: false, message: 'Please enter a search query' };
    }
    if (trimmed.length < 2) {
        return { valid: false, message: 'Search query must be at least 2 characters long' };
    }
    if (trimmed.length > 50) {
        return { valid: false, message: 'Search query must be less than 50 characters' };
    }
    return { valid: true, query: trimmed };
}

function colormagicShowError(message) {
    const errorElement = document.getElementById('colormagic-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function colormagicClearError() {
    const errorElement = document.getElementById('colormagic-error');
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

function colormagicShowLoading() {
    const loadingElement = document.getElementById('colormagic-loading');
    if (loadingElement) {
        loadingElement.classList.add('show');
    }
}

function colormagicHideLoading() {
    const loadingElement = document.getElementById('colormagic-loading');
    if (loadingElement) {
        loadingElement.classList.remove('show');
    }
}

function colormagicSetButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// ito naman is function para mag fetch ng data galing sa colormagic api 
async function colormagicFetchPalettes(searchQuery) {
    const apiUrl = COLORMAGIC_API_BASE_URL + '?q=' + encodeURIComponent(searchQuery);
    const proxyServices = [
        'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(apiUrl),
        'https://thingproxy.freeboard.io/fetch/' + apiUrl,
        'https://corsproxy.io/?' + encodeURIComponent(apiUrl)
    ];
    
    for (let i = 0; i < proxyServices.length; i++) {
        try {
            const response = await fetch(proxyServices[i]);
            
            if (response.ok) {
                const data = await response.json();
                return { success: true, data: data };
            }
        } catch (error) {
            if (i === proxyServices.length - 1) {
                return { success: false, error: 'All proxy services failed. Please try again later.' };
            }
            continue;
        }
    }
    
    return { success: false, error: 'Failed to fetch color palettes' };
}

function colormagicCopyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            colormagicShowCopyFeedback(text);
        }).catch(function() {
            colormagicShowCopyFeedback(text, false);
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            colormagicShowCopyFeedback(text);
        } catch (error) {
            colormagicShowCopyFeedback(text, false);
        }
        document.body.removeChild(textArea);
    }
}

function colormagicShowCopyFeedback(hexCode, success) {
    if (success === undefined) {
        success = true;
    }
    
    const feedback = document.createElement('div');
    feedback.className = 'colormagic-copy-feedback';
    feedback.textContent = success ? hexCode + ' copied!' : 'Copy failed';
    document.body.appendChild(feedback);
    
    setTimeout(function() {
        feedback.classList.add('show');
    }, 10);
    
    setTimeout(function() {
        feedback.classList.remove('show');
        setTimeout(function() {
            document.body.removeChild(feedback);
        }, 300);
    }, 2000);
}

function colormagicCreateColorSwatch(color) {
    const swatch = document.createElement('div');
    swatch.className = 'colormagic-swatch';
    swatch.style.backgroundColor = color;
    swatch.setAttribute('data-color', color);
    
    const hexText = document.createElement('span');
    hexText.className = 'colormagic-swatch-hex';
    hexText.textContent = color;
    swatch.appendChild(hexText);
    
    swatch.addEventListener('click', function() {
        colormagicCopyToClipboard(color);
    });
    
    return swatch;
}

function colormagicCreateTag(tag) {
    const tagElement = document.createElement('span');
    tagElement.className = 'colormagic-tag';
    tagElement.textContent = tag;
    return tagElement;
}

// dito is yung function para mag create ng cards kung saan ididsplay doon yung pallete
function colormagicCreatePaletteCard(palette) {
    const card = document.createElement('div');
    card.className = 'colormagic-card';
    
    const colorsContainer = document.createElement('div');
    colorsContainer.className = 'colormagic-colors';
    
    palette.colors.forEach(function(color) {
        const swatch = colormagicCreateColorSwatch(color);
        colorsContainer.appendChild(swatch);
    });
    
    const infoContainer = document.createElement('div');
    infoContainer.className = 'colormagic-info';
    
    const title = document.createElement('h3');
    title.className = 'colormagic-palette-title';
    title.textContent = palette.text || 'Untitled Palette';
    infoContainer.appendChild(title);
    
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'colormagic-tags';
    
    if (palette.tags && palette.tags.length > 0) {
        palette.tags.slice(0, 8).forEach(function(tag) {
            const tagElement = colormagicCreateTag(tag);
            tagsContainer.appendChild(tagElement);
        });
    }
    infoContainer.appendChild(tagsContainer);
    
    const metaContainer = document.createElement('div');
    metaContainer.className = 'colormagic-meta';
    
    const likes = document.createElement('span');
    likes.className = 'colormagic-likes';
    likes.textContent = palette.likesCount + ' likes';
    metaContainer.appendChild(likes);
    
    infoContainer.appendChild(metaContainer);
    
    card.appendChild(colorsContainer);
    card.appendChild(infoContainer);
    
    return card;
}

// ito naman function para mag display ng results 
function colormagicDisplayResults(palettes) {
    const resultsContainer = document.getElementById('colormagic-results');
    if (!resultsContainer) {
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    if (!palettes || palettes.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'colormagic-no-results';
        noResults.textContent = 'No color palettes found. Try a different search term.';
        resultsContainer.appendChild(noResults);
        return;
    }
    
    const limitSelect = document.getElementById('colormagic-limit-select');
    let limit = 'all';
    if (limitSelect) {
        limit = limitSelect.value;
    }
    
    let palettesToShow = palettes;
    if (limit !== 'all') {
        const limitNum = parseInt(limit, 10);
        palettesToShow = palettes.slice(0, limitNum);
    }
    
    palettesToShow.forEach(function(palette) {
        const card = colormagicCreatePaletteCard(palette);
        resultsContainer.appendChild(card);
    });
}

//dito naman yng pag kukunin yung laman ng search bar para iprocess or magamit sa pag fefectch ng pallete
async function colormagicHandleSearch() {
    const searchInput = document.getElementById('colormagic-search-input');
    const searchButton = document.getElementById('colormagic-search-button');
    
    if (!searchInput || !searchButton) {
        return;
    }
    
    const searchQuery = searchInput.value;
    const validation = colormagicValidateInput(searchQuery);
    
    if (!validation.valid) {
        colormagicShowError(validation.message);
        return;
    }
    
    colormagicClearError();
    colormagicSetButtonLoading(searchButton, true);
    colormagicShowLoading();
    
    const result = await colormagicFetchPalettes(validation.query);
    
    colormagicSetButtonLoading(searchButton, false);
    colormagicHideLoading();
    
    if (!result.success) {
        colormagicShowError('Failed to fetch color palettes. Please try again later.');
        colormagicAllPalettes = [];
        colormagicDisplayResults([]);
        return;
    }
    
    colormagicAllPalettes = result.data;
    colormagicDisplayResults(colormagicAllPalettes);
}

function colormagicHandleSearchButtonClick() {
    colormagicHandleSearch();
}

function colormagicHandleSearchInputKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        colormagicHandleSearch();
    }
}

function colormagicHandleLimitChange() {
    if (colormagicAllPalettes && colormagicAllPalettes.length > 0) {
        colormagicDisplayResults(colormagicAllPalettes);
    }
}

function colormagicSetupEventListeners() {
    const searchButton = document.getElementById('colormagic-search-button');
    const searchInput = document.getElementById('colormagic-search-input');
    const limitSelect = document.getElementById('colormagic-limit-select');
    
    if (searchButton) {
        searchButton.addEventListener('click', colormagicHandleSearchButtonClick);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', colormagicHandleSearchInputKeyPress);
        searchInput.addEventListener('input', colormagicClearError);
    }
    
    if (limitSelect) {
        limitSelect.addEventListener('change', colormagicHandleLimitChange);
    }
}

colormagicSetupEventListeners();

