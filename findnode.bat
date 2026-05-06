@echo off
where node > C:\Users\Usuario\Desktop\Financiapp\nodeinfo.txt 2>&1
where npm >> C:\Users\Usuario\Desktop\Financiapp\nodeinfo.txt 2>&1
node --version >> C:\Users\Usuario\Desktop\Financiapp\nodeinfo.txt 2>&1
echo PATH=%PATH% >> C:\Users\Usuario\Desktop\Financiapp\nodeinfo.txt 2>&1
