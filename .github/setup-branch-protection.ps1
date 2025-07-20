# PowerShell script to set up branch protection rules
# Run this if the automated workflow doesn't work due to permissions

Write-Host "Setting up branch protection for WANFAM repository..." -ForegroundColor Green

# Check if gh CLI is installed
try {
    $null = Get-Command gh -ErrorAction Stop
} catch {
    Write-Host "GitHub CLI (gh) is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if user is authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please authenticate with GitHub CLI first:" -ForegroundColor Red
    Write-Host "gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Setting up branch protection rules for 'main' branch..." -ForegroundColor Blue

# Create the protection rules JSON
$protectionRules = @{
    required_status_checks = @{
        strict = $true
        contexts = @("validate-changes")
    }
    enforce_admins = $false
    required_pull_request_reviews = @{
        required_approving_review_count = 1
        dismiss_stale_reviews = $true
        require_code_owner_reviews = $true
        require_last_push_approval = $false
    }
    restrictions = $null
    allow_force_pushes = $false
    allow_deletions = $false
    required_conversation_resolution = $true
} | ConvertTo-Json -Depth 3

# Apply the protection rules
try {
    $protectionRules | gh api repos/:owner/:repo/branches/main/protection --method PUT --input -
    Write-Host "✅ Branch protection rules have been set up successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Current protection rules:" -ForegroundColor Cyan
    Write-Host "- Require 1 approving review" -ForegroundColor White
    Write-Host "- Require status checks (validate-changes)" -ForegroundColor White
    Write-Host "- Require code owner reviews" -ForegroundColor White
    Write-Host "- Dismiss stale reviews" -ForegroundColor White
    Write-Host "- Require conversation resolution" -ForegroundColor White
    Write-Host "- Block force pushes and deletions" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to set up branch protection rules:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "You may need admin permissions on the repository." -ForegroundColor Yellow
}
