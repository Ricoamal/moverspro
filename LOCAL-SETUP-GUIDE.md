# 🚛 **MOVEEASE PRO - LOCAL DEVELOPMENT SETUP**

## 🚨 **FIXING "CONNECTION REFUSED" ERRORS**

You're seeing these errors because the development server isn't running. Let's fix this step by step.

---

## 🔧 **QUICK FIX METHODS**

### **Method 1: Automated Fix (Recommended)**

#### **Windows Users:**
```bash
# Double-click this file or run in Command Prompt:
start-local.bat
```

#### **Mac/Linux Users:**
```bash
# Make executable and run:
chmod +x start-local.sh
./start-local.sh
```

#### **Any Platform:**
```bash
# Run the diagnostic script:
node fix-local-server.js
```

### **Method 2: Manual Step-by-Step**

#### **Step 1: Verify Location**
```bash
# Check you're in the MoveEase Pro directory
ls -la  # (Mac/Linux) or dir (Windows)

# You should see:
# - package.json
# - src/
# - vite.config.js
# - index.html
```

#### **Step 2: Install Dependencies**
```bash
# Install all required packages
npm install

# If that fails, try:
npm cache clean --force
npm install --legacy-peer-deps
```

#### **Step 3: Start Development Server**
```bash
# Try these commands in order:

# Method A (Primary):
npm start

# Method B (Alternative):
npm run dev

# Method C (Different port):
npm start -- --port 3000

# Method D (Direct Vite):
npx vite
```

---

## 🔍 **TROUBLESHOOTING COMMON ISSUES**

### **Issue 1: "npm: command not found"**
**Solution:**
- Install Node.js from https://nodejs.org
- Restart your terminal
- Verify: `node --version` and `npm --version`

### **Issue 2: "Port 5173 already in use"**
**Solution:**
```bash
# Windows:
netstat -ano | findstr :5173
taskkill /f /pid [PID_NUMBER]

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use different port:
npm start -- --port 3000
```

### **Issue 3: "Module not found" errors**
**Solution:**
```bash
# Delete and reinstall dependencies
rm -rf node_modules package-lock.json  # (Mac/Linux)
rmdir /s node_modules & del package-lock.json  # (Windows)

npm install
```

### **Issue 4: "Permission denied" errors**
**Solution:**
```bash
# Mac/Linux - Fix permissions:
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ./node_modules

# Windows - Run as Administrator:
# Right-click Command Prompt → "Run as Administrator"
```

### **Issue 5: "EACCES" or "EPERM" errors**
**Solution:**
```bash
# Use npx instead of global install:
npx create-vite@latest temp-test --template react
cd temp-test
npm install
npm run dev

# If this works, the issue is with your project setup
```

---

## 📊 **VERIFICATION CHECKLIST**

### **✅ Prerequisites Check**
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm 8+ installed (`npm --version`)
- [ ] In correct directory (has `package.json`)
- [ ] Internet connection active

### **✅ Project Structure Check**
- [ ] `package.json` exists
- [ ] `src/index.jsx` exists
- [ ] `index.html` exists
- [ ] `vite.config.js` exists
- [ ] `node_modules/` directory exists

### **✅ Server Running Check**
- [ ] No "Connection refused" errors
- [ ] Browser opens to `http://localhost:5173`
- [ ] Page loads without errors
- [ ] Console shows no critical errors

---

## 🎯 **SUCCESS INDICATORS**

### **When Server Starts Successfully:**
```
🚀 MoveEase Pro Development Server

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.xxx:5173/
  ➜  ready in 1234ms

  📱 Server running on all interfaces
  🔄 Hot reload enabled
  ⚡ Vite optimized build
```

### **What You Should See in Browser:**
- ✅ MoveEase Pro homepage loads
- ✅ Navigation menu works
- ✅ No console errors (F12 → Console)
- ✅ Responsive design on mobile/desktop
- ✅ All images and styles load

---

## 🚀 **NEXT STEPS AFTER LOCAL SUCCESS**

### **Once Local Server is Running:**

1. **Test Core Features:**
   - [ ] Homepage navigation
   - [ ] Website builder interface
   - [ ] Customer management pages
   - [ ] Staff management pages
   - [ ] Settings pages

2. **Test Responsive Design:**
   - [ ] Mobile view (F12 → Device toolbar)
   - [ ] Tablet view
   - [ ] Desktop view

3. **Check Performance:**
   - [ ] Fast page loading
   - [ ] Smooth animations
   - [ ] No console errors

4. **Ready for Deployment:**
   - [ ] All features working locally
   - [ ] No critical errors
   - [ ] Performance acceptable
   - [ ] Ready for Vercel deployment

---

## 🆘 **STILL HAVING ISSUES?**

### **Advanced Troubleshooting:**

#### **Complete Reset:**
```bash
# Nuclear option - start fresh
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

#### **Check System Requirements:**
```bash
# Verify system compatibility
node --version  # Should be 16+
npm --version   # Should be 8+
npx --version   # Should work

# Check available memory
# Windows: wmic OS get TotalVisibleMemorySize /value
# Mac/Linux: free -h
```

#### **Alternative Package Managers:**
```bash
# Try Yarn instead of npm
npm install -g yarn
yarn install
yarn dev

# Or try pnpm
npm install -g pnpm
pnpm install
pnpm dev
```

### **Get Help:**
If you're still stuck:
1. **Check the error messages** carefully
2. **Copy the exact error** and search online
3. **Try the automated fix script**: `node fix-local-server.js`
4. **Use alternative start methods** listed above

---

## 🎉 **SUCCESS!**

### **When Everything Works:**
- ✅ **Local server running** on http://localhost:5173
- ✅ **MoveEase Pro loads** in browser
- ✅ **No connection errors**
- ✅ **All features accessible**
- ✅ **Ready for testing and deployment**

**🚛 Once local development is working, we can proceed with Vercel deployment!**

The local server is essential for:
- 🔧 **Development and testing**
- 🎨 **Real-time code changes**
- 🧪 **Feature verification**
- 🚀 **Pre-deployment validation**

**Let's get your local server running first, then we'll deploy to production!** 🎊
