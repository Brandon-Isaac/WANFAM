# PowerShell script to set up branch protection rules
# Run this if the automated workflow doesn't work due to permissions

param(
    [int]$MinReviewers = 1,
    [switch]$RequireCodeOwners = $true,
    [string[]]$Branches = @("main", "master")
)

Write-Host "Setting up branch protection for WANFAM repository..." -ForegroundColor Green
Write-Host "Configuration: Min Reviewers = $MinReviewers, Require Code Owners = $RequireCodeOwners" -ForegroundColor Yellow
Write-Host "Branches to protect: $($Branches -join ', ')" -ForegroundColor Yellow

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

Write-Host "Setting up branch protection rules..." -ForegroundColor Blue

# Create the protection rules JSON
$protectionRules = @{
    required_status_checks = @{
        strict = $true
        contexts = @("validate-changes")
    }
    enforce_admins = $false
    required_pull_request_reviews = @{
        required_approving_review_count = $MinReviewers
        dismiss_stale_reviews = $true
        require_code_owner_reviews = $RequireCodeOwners
        require_last_push_approval = $false
    }
    restrictions = $null
    allow_force_pushes = $false
    allow_deletions = $false
    required_conversation_resolution = $true
} | ConvertTo-Json -Depth 3

# Apply protection rules to each branch
foreach ($branch in $Branches) {
    Write-Host "Setting up protection for branch: $branch" -ForegroundColor Cyan
    
    # Check if branch exists
    $branchExists = $false
    try {
        $null = gh api "repos/:owner/:repo/branches/$branch" 2>$null
        $branchExists = $true
    } catch {
        Write-Host "⚠️ Branch '$branch' does not exist, skipping..." -ForegroundColor Yellow
        continue
    }
    
    if ($branchExists) {
        try {
            $protectionRules | gh api "repos/:owner/:repo/branches/$branch/protection" --method PUT --input -
            Write-Host "✅ Branch protection rules set up successfully for '$branch'!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to set up branch protection for '$branch':" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
        }
    }
}

# Apply the protection rules
try {
    Write-Host ""
    Write-Host "🎉 Branch protection setup completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Current protection rules applied to: $($Branches -join ', ')" -ForegroundColor Cyan
    Write-Host "- Require $MinReviewers approving review(s)" -ForegroundColor White
    Write-Host "- Require status checks (validate-changes)" -ForegroundColor White
    Write-Host "- Require code owner reviews: $RequireCodeOwners" -ForegroundColor White
    Write-Host "- Dismiss stale reviews" -ForegroundColor White
    Write-Host "- Require conversation resolution" -ForegroundColor White
    Write-Host "- Block force pushes and deletions" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage examples:" -ForegroundColor Cyan
    Write-Host "  .\setup-branch-protection.ps1" -ForegroundColor Gray
    Write-Host "  .\setup-branch-protection.ps1 -MinReviewers 2" -ForegroundColor Gray
    Write-Host "  .\setup-branch-protection.ps1 -Branches @('main')" -ForegroundColor Gray
    Write-Host "  .\setup-branch-protection.ps1 -Branches @('master', 'develop')" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to set up branch protection rules:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "You may need admin permissions on the repository." -ForegroundColor Yellow
}
