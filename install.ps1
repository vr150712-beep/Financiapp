$nodeInfo = (Get-Command node -ErrorAction SilentlyContinue)
$npmInfo  = (Get-Command npm  -ErrorAction SilentlyContinue)

"node: $($nodeInfo.Source)"  | Out-File "C:\Users\Usuario\Desktop\Financiapp\nodeinfo.txt" -Encoding utf8
"npm:  $($npmInfo.Source)"   | Out-File "C:\Users\Usuario\Desktop\Financiapp\nodeinfo.txt" -Append -Encoding utf8
"PATH: $env:PATH"            | Out-File "C:\Users\Usuario\Desktop\Financiapp\nodeinfo.txt" -Append -Encoding utf8

if ($npmInfo) {
    Set-Location "C:\Users\Usuario\Desktop\Financiapp"
    & npm install *>&1 | Out-File "C:\Users\Usuario\Desktop\Financiapp\npm-install.log" -Encoding utf8
    "INSTALL_EXIT: $LASTEXITCODE" | Out-File "C:\Users\Usuario\Desktop\Financiapp\npm-install.log" -Append -Encoding utf8
} else {
    "npm not found in PATH" | Out-File "C:\Users\Usuario\Desktop\Financiapp\npm-install.log" -Encoding utf8
}
