const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("import React, { useState, useEffect, useRef } from 'react';", 
  "import React, { useState, useEffect, useRef } from 'react';\nimport AuthScreen from './components/AuthScreen';\nimport { auth } from './firebase';\nimport { onAuthStateChanged, signOut } from 'firebase/auth';");

content = content.replace("  const [currentUserId, setCurrentUserId] = useState<string>('u1'); // Defaults to Admin User",
  "  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Uses Firebase Auth");

const effectCode = `
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUserId(firebaseUser.uid);
        // Ensure user exists in Express DB
        try {
          await fetch('/api/users/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: firebaseUser.uid, name: firebaseUser.displayName || firebaseUser.email?.split('@')[0], phone: '09120000000', email: firebaseUser.email })
          });
          fetchDB(true);
        } catch (err) {
          console.error("Failed to sync user", err);
        }
      } else {
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);
`;

content = content.replace("  useEffect(() => {\n    fetchDB(true);\n  }, []);",
  "  useEffect(() => {\n    fetchDB(true);\n  }, []);\n" + effectCode);

content = content.replace("const currentUser = dbState.users.find(u => u.id === currentUserId) || dbState.users[0];",
  "const currentUser = dbState.users.find(u => u.id === currentUserId);");

const renderStart = `  return (
    <div className="min-h-screen`;

const renderReplacement = `  if (!currentUserId) {
    return <AuthScreen onSuccess={(uid) => {}} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>در حال بارگذاری اطلاعات کاربر...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen`;

content = content.replace(renderStart, renderReplacement);

fs.writeFileSync('src/App.tsx', content);
