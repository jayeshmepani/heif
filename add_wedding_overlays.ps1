
$file = "e:\project\HEIF\HEIF\work-detailwedding.html"
$content = Get-Content $file -Raw

# Helper to avoid double injection
if ($content -match "image-overlay") {
    Write-Host "Overlays likely already present. Exiting to prevent duplication."
    exit
}

# Regex to capture the image item content
# We look for <div class="image-item"> followed by an img tag.
# We will append the overlay after the img tag, before the closing div.
# Note: The 'before the closing div' part is tricky with regex if there's whitespace.
# Strategy: Replace <div class="image-item"><img ...> with <div class="image-item"><img ...><div class="overlay">...</div>

# We need to iterate carefully to handle the "Story" (first 6) vs "Post" (rest) logic.
# Regex.Replace with a MatchEvaluator is perfect for this.

$counter = 0

$callback = { param($match) 
    $global:counter++
    
    $text = "POST"
    if ($global:counter -le 6) {
        $text = "STORY"
    }
    
    $wholeBlock = $match.Value
    # $wholeBlock is "<div class="image-item"><img ...>"
    
    # We want to append the overlay inside this div. 
    # But wait, the input string usually closes the div like </div>. 
    # The regex below matches up to the closing > of the img tag.
    # So we are effectively inserting BETWEEN <img ...> and </div>.
    # But we need to verify the HTML structure. 
    # The file shows: <div class="image-item"><img ...></div>
    
    # Let's adjust regex to capture the whole line or block if possible.
    # Or just replace the img tag part with img tag + overlay.
    
    return "$wholeBlock`n    <div class=""image-overlay""><span class=""image-overlay-text"">$text</span></div>"
}

# Regex matches: <div class="image-item">\s*<img[^>]+>
# This captures the opening div and the img tag.
$regex = [regex]'(<div class="image-item">\s*<img[^>]+>)'

$newContent = $regex.Replace($content, $callback)

Set-Content -Path $file -Value $newContent -Encoding UTF8
Write-Host "Updated $file with overlays."
