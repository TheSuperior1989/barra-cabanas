#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const path = require('path');
const fs = require('fs');

console.log('🎯 BARRA CABANAS COMPREHENSIVE E2E BOOKING WORKFLOW TEST');
console.log('='.repeat(70));
console.log('This test will validate the complete booking workflow:');
console.log('• Website booking form submission');
console.log('• Database integration and storage');
console.log('• Admin dashboard booking management');
console.log('• Email notification system');
console.log('• Real-time updates and performance');
console.log('='.repeat(70));

let websiteServer = null;
let adminServer = null;

// Helper function to wait for server to be ready
function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    function checkServer() {
      const timeElapsed = Date.now() - startTime;
      if (timeElapsed > timeout) {
        reject(new Error(`Server at ${url} did not start within ${timeout}ms`));
        return;
      }

      // Use fetch to check if server is responding
      fetch(url)
        .then(response => {
          if (response.ok || response.status === 404) {
            console.log(`✅ Server at ${url} is ready`);
            resolve();
          } else {
            setTimeout(checkServer, 1000);
          }
        })
        .catch(() => {
          setTimeout(checkServer, 1000);
        });
    }
    
    checkServer();
  });
}

// Function to start website server (Vite)
async function startWebsiteServer() {
  console.log('\n🌐 Starting Website Server (Vite)...');
  
  return new Promise((resolve, reject) => {
    websiteServer = spawn('npm', ['run', 'dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      cwd: process.cwd()
    });

    let serverReady = false;

    websiteServer.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Website] ${output.trim()}`);
      
      if (output.includes('Local:') && output.includes('5173') && !serverReady) {
        serverReady = true;
        console.log('✅ Website server started successfully');
        resolve();
      }
    });

    websiteServer.stderr.on('data', (data) => {
      console.log(`[Website Error] ${data.toString().trim()}`);
    });

    websiteServer.on('error', (error) => {
      console.error('❌ Failed to start website server:', error);
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Website server failed to start within 30 seconds'));
      }
    }, 30000);
  });
}

// Function to start admin server (Next.js)
async function startAdminServer() {
  console.log('\n🔐 Starting Admin Server (Next.js)...');
  
  return new Promise((resolve, reject) => {
    adminServer = spawn('npm', ['run', 'dev-next'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      cwd: process.cwd()
    });

    let serverReady = false;

    adminServer.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Admin] ${output.trim()}`);
      
      if ((output.includes('Ready') || output.includes('started server')) && output.includes('3000') && !serverReady) {
        serverReady = true;
        console.log('✅ Admin server started successfully');
        resolve();
      }
    });

    adminServer.stderr.on('data', (data) => {
      console.log(`[Admin Error] ${data.toString().trim()}`);
    });

    adminServer.on('error', (error) => {
      console.error('❌ Failed to start admin server:', error);
      reject(error);
    });

    // Timeout after 45 seconds (Next.js can take longer)
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Admin server failed to start within 45 seconds'));
      }
    }, 45000);
  });
}

// Function to run Playwright tests
async function runPlaywrightTests() {
  console.log('\n🎭 Running Playwright E2E Tests...');
  
  try {
    // Ensure test results directory exists
    const testResultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir, { recursive: true });
    }

    // Run the specific booking workflow test
    const { stdout, stderr } = await execAsync(
      'npx playwright test src/__tests__/e2e/complete-booking-workflow.spec.ts --headed --project=chromium',
      { 
        cwd: process.cwd(),
        timeout: 120000 // 2 minutes timeout
      }
    );

    console.log('✅ Playwright tests completed successfully');
    console.log('\n📊 Test Results:');
    console.log(stdout);
    
    if (stderr) {
      console.log('\n⚠️ Test Warnings:');
      console.log(stderr);
    }

    return true;
  } catch (error) {
    console.error('❌ Playwright tests failed:');
    console.error(error.stdout || error.message);
    if (error.stderr) {
      console.error('Error details:', error.stderr);
    }
    return false;
  }
}

// Function to cleanup servers
function cleanup() {
  console.log('\n🧹 Cleaning up servers...');
  
  if (websiteServer) {
    websiteServer.kill('SIGTERM');
    console.log('✅ Website server stopped');
  }
  
  if (adminServer) {
    adminServer.kill('SIGTERM');
    console.log('✅ Admin server stopped');
  }
}

// Main test execution function
async function runCompleteTest() {
  try {
    console.log('\n🚀 Starting server setup...');
    
    // Start both servers in parallel
    await Promise.all([
      startWebsiteServer(),
      startAdminServer()
    ]);

    console.log('\n⏳ Waiting for servers to be fully ready...');
    
    // Wait for both servers to be responsive
    await Promise.all([
      waitForServer('http://localhost:5173'),
      waitForServer('http://localhost:3000')
    ]);

    console.log('\n✅ All servers are ready!');
    console.log('\n🎯 Starting comprehensive E2E tests...');

    // Run the Playwright tests
    const testsPassed = await runPlaywrightTests();

    if (testsPassed) {
      console.log('\n🎉 ALL TESTS PASSED! 🎉');
      console.log('='.repeat(50));
      console.log('✅ Website booking form is functional');
      console.log('✅ Database integration is working');
      console.log('✅ Admin dashboard is operational');
      console.log('✅ Booking workflow is complete');
      console.log('✅ Performance benchmarks met');
      console.log('='.repeat(50));
      
      console.log('\n📸 Screenshots saved in test-results/ directory:');
      console.log('• 01-website-booking-page.png');
      console.log('• 02-booking-form-modal.png');
      console.log('• 03-booking-confirmation.png');
      console.log('• 04-admin-login-page.png');
      console.log('• 05-admin-dashboard.png');
      console.log('• 06-bookings-management.png');
      console.log('• 07-booking-approved.png');
      console.log('• 08-final-booking-status.png');
      console.log('• 09-mobile-booking-page.png');
      
    } else {
      console.log('\n❌ SOME TESTS FAILED');
      console.log('Check the output above for details');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  } finally {
    cleanup();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️ Test interrupted by user');
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️ Test terminated');
  cleanup();
  process.exit(0);
});

// Start the test
runCompleteTest().catch((error) => {
  console.error('❌ Unexpected error:', error);
  cleanup();
  process.exit(1);
});
