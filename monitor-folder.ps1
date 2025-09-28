# Script para monitorar e atualizar a pasta automaticamente
param(
    [string]$Path = "C:\Users\Mathe\vscode tranalhos\nichofysite",
    [int]$IntervalSeconds = 60
)

Write-Host "🔍 Iniciando monitoramento da pasta: $Path" -ForegroundColor Green
Write-Host "⏰ Intervalo de verificação: $IntervalSeconds segundos" -ForegroundColor Yellow
Write-Host "📅 Iniciado em: $(Get-Date)" -ForegroundColor Cyan

while ($true) {
    try {
        # Verificar se a pasta existe
        if (Test-Path $Path) {
            # Listar arquivos modificados nos últimos 2 minutos
            $recentFiles = Get-ChildItem -Path $Path -Recurse -File | 
                Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-2) }
            
            if ($recentFiles.Count -gt 0) {
                Write-Host "🔄 Arquivos modificados encontrados:" -ForegroundColor Yellow
                foreach ($file in $recentFiles) {
                    Write-Host "  📄 $($file.Name) - $($file.LastWriteTime)" -ForegroundColor White
                }
            }
            
            # Verificar status do git
            Set-Location $Path
            $gitStatus = git status --porcelain 2>$null
            if ($gitStatus) {
                Write-Host "📝 Mudanças não commitadas detectadas:" -ForegroundColor Red
                Write-Host $gitStatus -ForegroundColor White
            }
            
            # Verificar se há processos Node.js rodando
            $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
            if ($nodeProcesses) {
                Write-Host "🚀 Processos Node.js ativos: $($nodeProcesses.Count)" -ForegroundColor Green
            }
            
            Write-Host "✅ Pasta verificada - $(Get-Date)" -ForegroundColor Green
        } else {
            Write-Host "❌ Pasta não encontrada: $Path" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "⚠️ Erro durante verificação: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Aguardar próximo intervalo
    Start-Sleep -Seconds $IntervalSeconds
}
