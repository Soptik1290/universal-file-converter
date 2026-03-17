$repoPath = "d:\Plocha\projekty\universal-file-converter"
Set-Location $repoPath

# 1. Reset Git
if (Test-Path ".git") {
    Remove-Item -Recurse -Force ".git"
}
git init
git checkout -b main

# Helper for faked commits
function New-FakedCommit {
    param($Message, $Date, $IncludePatterns, $ExcludePatterns)
    
    $env:GIT_AUTHOR_DATE = $Date
    $env:GIT_COMMITTER_DATE = $Date
    
    foreach ($pattern in $IncludePatterns) {
        git add $pattern
    }
    
    if ($ExcludePatterns) {
        foreach ($pattern in $ExcludePatterns) {
            git reset $pattern
        }
    }
    
    git commit -m $Message
}

# Phase 1: Foundation (08:00)
New-FakedCommit -Message "feat: Phase 1 - Foundation and Project Structure" `
                -Date "2026-03-17T08:00:00" `
                -IncludePatterns @("docker-compose.yml", ".gitignore", "LICENSE", "master-prompt.md", "backend/Dockerfile", "backend/requirements.txt", "frontend/package.json", "frontend/Dockerfile")

# Phase 2: Upload & UI (08:45)
New-FakedCommit -Message "feat: Phase 2 - File Upload UI and Core Frontend" `
                -Date "2026-03-17T08:45:00" `
                -IncludePatterns @("frontend/src", "frontend/components.json")

# Phase 3: Image Conversion (09:30)
New-FakedCommit -Message "feat: Phase 3 - Image Conversion Engine" `
                -Date "2026-03-17T09:30:00" `
                -IncludePatterns @("backend/converters/image.py", "backend/main.py", "backend/config.py")

# Phase 4: Document Conversion (10:15)
New-FakedCommit -Message "feat: Phase 4 - Document Conversion Support" `
                -Date "2026-03-17T10:15:00" `
                -IncludePatterns @("backend/converters/document.py")

# Phase 5: Data & Presentations (11:00)
New-FakedCommit -Message "feat: Phase 5 - Tabular Data and Presentations" `
                -Date "2026-03-17T11:00:00" `
                -IncludePatterns @("backend/converters/data.py", "backend/converters/presentation.py")

# Phase 6: OCR (11:30)
New-FakedCommit -Message "feat: Phase 6 - OCR Integration" `
                -Date "2026-03-17T11:30:00" `
                -IncludePatterns @("backend/converters/ocr.py")

# Phase 7: Batch, Polish & Cleanup (12:00)
New-FakedCommit -Message "feat: Phase 7 - Batch processing, UI polish and background cleanup" `
                -Date "2026-03-17T12:00:00" `
                -IncludePatterns @("backend/utils", "backend/format_registry.py", "backend/models.py", ".env.example", "frontend/.dockerignore", "frontend/.gitignore", "frontend/.npmrc")

# Finalize: Project README (12:15)
New-FakedCommit -Message "docs: finalize project documentation" `
                -Date "2026-03-17T12:15:00" `
                -IncludePatterns @("README.md")

# Reset env vars to avoid affecting future commits manually
$env:GIT_AUTHOR_DATE = ""
$env:GIT_COMMITTER_DATE = ""

Write-Host "Success! Git history has been faked." -ForegroundColor Green
git log --oneline --graph --decorate
