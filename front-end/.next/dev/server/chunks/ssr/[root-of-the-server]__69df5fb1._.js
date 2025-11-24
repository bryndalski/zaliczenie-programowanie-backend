module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/env-check.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Debug helper - sprawdza czy zmienne środowiskowe są załadowane
__turbopack_context__.s([
    "checkEnvVariables",
    ()=>checkEnvVariables
]);
function checkEnvVariables() {
    const requiredEnvVars = {
        'NEXT_PUBLIC_COGNITO_USER_POOL_ID': ("TURBOPACK compile-time value", "eu-central-1_dBuqwAOur"),
        'NEXT_PUBLIC_COGNITO_CLIENT_ID': ("TURBOPACK compile-time value", "53mjrf78hmn67fe0sf1lfjti8n"),
        'NEXT_PUBLIC_COGNITO_REGION': ("TURBOPACK compile-time value", "eu-central-1"),
        'NEXT_PUBLIC_API_GATEWAY_URL': ("TURBOPACK compile-time value", "https://io3jsoifpi.execute-api.eu-central-1.amazonaws.com/default")
    };
    const missing = [];
    Object.entries(requiredEnvVars).forEach(([key, value])=>{
        if (!value) {
            missing.push(key);
        }
    });
    if (missing.length > 0) {
        console.error('❌ Missing environment variables:', missing);
        console.error('Please check your .env.local file');
        return false;
    }
    console.log('✅ All required environment variables are set:');
    Object.entries(requiredEnvVars).forEach(([key, value])=>{
        // Show first and last 4 characters for security
        const maskedValue = value.length > 8 ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : '****';
        console.log(`  ${key}: ${maskedValue}`);
    });
    return true;
}
}),
"[project]/src/lib/amplify-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "configureAmplify",
    ()=>configureAmplify,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$aws$2d$amplify$2f$dist$2f$esm$2f$initSingleton$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__DefaultAmplify__as__Amplify$3e$__ = __turbopack_context__.i("[project]/node_modules/aws-amplify/dist/esm/initSingleton.mjs [app-ssr] (ecmascript) <export DefaultAmplify as Amplify>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2d$check$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env-check.ts [app-ssr] (ecmascript)");
;
;
const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: ("TURBOPACK compile-time value", "eu-central-1_dBuqwAOur"),
            userPoolClientId: ("TURBOPACK compile-time value", "53mjrf78hmn67fe0sf1lfjti8n"),
            region: ("TURBOPACK compile-time value", "eu-central-1"),
            signUpVerificationMethod: 'code',
            loginWith: {
                email: true
            }
        }
    }
};
function configureAmplify() {
    try {
        // Check if environment variables are set
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2d$check$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkEnvVariables"])()) {
            throw new Error('Missing required environment variables');
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$aws$2d$amplify$2f$dist$2f$esm$2f$initSingleton$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__DefaultAmplify__as__Amplify$3e$__["Amplify"].configure(amplifyConfig, {
            ssr: true
        });
        console.log('✅ Amplify configured successfully');
    } catch (error) {
        console.error('❌ Error configuring Amplify:', error);
        throw error;
    }
}
const __TURBOPACK__default__export__ = amplifyConfig;
}),
"[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$getCurrentUser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/getCurrentUser.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$signOut$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signOut.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$amplify$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/amplify-config.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        user: null,
        loading: true,
        isAuthenticated: false
    });
    const [isConfigured, setIsConfigured] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Configure Amplify once on mount
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$amplify$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configureAmplify"])();
            setIsConfigured(true);
        } catch (error) {
            console.error('Failed to configure Amplify:', error);
            setState({
                user: null,
                loading: false,
                isAuthenticated: false
            });
        }
    }, []);
    const checkAuthState = async ()=>{
        if (!isConfigured) {
            console.log('Amplify not yet configured, skipping auth check');
            return;
        }
        try {
            console.log('🔍 Checking auth state...');
            const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$getCurrentUser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUser"])();
            console.log('✅ User found:', {
                userId: user.userId,
                username: user.username,
                signInDetails: user.signInDetails
            });
            const userData = {
                id: user.userId,
                email: user.signInDetails?.loginId || user.username || '',
                username: user.username,
                emailVerified: true
            };
            setState({
                user: userData,
                loading: false,
                isAuthenticated: true
            });
            console.log('✅ Auth state updated - user is authenticated');
        } catch (error) {
            console.log('❌ No authenticated user found:', error);
            setState({
                user: null,
                loading: false,
                isAuthenticated: false
            });
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isConfigured) {
            checkAuthState();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isConfigured
    ]);
    const handleSignOut = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$signOut$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])();
            setState({
                user: null,
                loading: false,
                isAuthenticated: false
            });
        } catch (error) {
            console.error('Error signing out:', error);
            // Force clear the state even if sign-out fails
            setState({
                user: null,
                loading: false,
                isAuthenticated: false
            });
        }
    };
    const refreshAuth = async ()=>{
        console.log('🔄 Refreshing auth state...');
        setState((prev)=>({
                ...prev,
                loading: true
            }));
        await checkAuthState();
    };
    const value = {
        ...state,
        signOut: handleSignOut,
        refreshAuth
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__69df5fb1._.js.map