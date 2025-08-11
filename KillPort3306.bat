@echo off
set PORT=3306
echo Đang kiểm tra process dùng port %PORT%...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo Đã phát hiện PID đang dùng port %PORT%: %%a
    echo Đang kill process %%a...
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo ❌ Không thể kill process %%a (có thể là quyền admin hoặc không tồn tại).
    ) else (
        echo ✅ Đã kill process %%a thành công.
    )
    goto done
)

echo ✅ Port %PORT% hiện không bị chiếm.
:done
pause
