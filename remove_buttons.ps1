# PowerShell script to remove Quote Settings and Email Settings buttons
$filePath = "src\components\QuoteManagement.tsx"
$content = Get-Content $filePath

# Remove lines containing the button definitions
$filteredContent = @()
$skipNext = 0
$inQuoteSettingsButton = $false
$inEmailSettingsButton = $false

for ($i = 0; $i -lt $content.Length; $i++) {
    $line = $content[$i]
    
    # Check if we're starting a Quote Settings button
    if ($line -match "onClick.*setShowSettings\(true\)") {
        $inQuoteSettingsButton = $true
        continue
    }
    
    # Check if we're starting an Email Settings button  
    if ($line -match "onClick.*setShowEmailSettings\(true\)") {
        $inEmailSettingsButton = $true
        continue
    }
    
    # Skip lines that are part of the buttons
    if ($inQuoteSettingsButton) {
        if ($line -match "</button>") {
            $inQuoteSettingsButton = $false
        }
        continue
    }
    
    if ($inEmailSettingsButton) {
        if ($line -match "</button>") {
            $inEmailSettingsButton = $false
        }
        continue
    }
    
    # Keep all other lines
    $filteredContent += $line
}

# Write the filtered content back to the file
$filteredContent | Set-Content $filePath

Write-Host "Buttons removed successfully!"
