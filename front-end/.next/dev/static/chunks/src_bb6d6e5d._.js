(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/env-check.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Debug helper - sprawdza czy zmienne środowiskowe są załadowane
__turbopack_context__.s([
    "checkEnvVariables",
    ()=>checkEnvVariables
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/amplify-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "configureAmplify",
    ()=>configureAmplify,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$aws$2d$amplify$2f$dist$2f$esm$2f$initSingleton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__DefaultAmplify__as__Amplify$3e$__ = __turbopack_context__.i("[project]/node_modules/aws-amplify/dist/esm/initSingleton.mjs [app-client] (ecmascript) <export DefaultAmplify as Amplify>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env-check.ts [app-client] (ecmascript)");
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
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkEnvVariables"])()) {
            throw new Error('Missing required environment variables');
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$aws$2d$amplify$2f$dist$2f$esm$2f$initSingleton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__DefaultAmplify__as__Amplify$3e$__["Amplify"].configure(amplifyConfig, {
            ssr: true
        });
        console.log('✅ Amplify configured successfully');
    } catch (error) {
        console.error('❌ Error configuring Amplify:', error);
        throw error;
    }
}
const __TURBOPACK__default__export__ = amplifyConfig;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$getCurrentUser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/getCurrentUser.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$signOut$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signOut.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$amplify$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/amplify-config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        user: null,
        loading: true,
        isAuthenticated: false
    });
    const [isConfigured, setIsConfigured] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Configure Amplify once on mount
            try {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$amplify$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["configureAmplify"])();
                setIsConfigured(true);
            } catch (error) {
                console.error('Failed to configure Amplify:', error);
                setState({
                    user: null,
                    loading: false,
                    isAuthenticated: false
                });
            }
        }
    }["AuthProvider.useEffect"], []);
    const checkAuthState = async ()=>{
        if (!isConfigured) {
            console.log('Amplify not yet configured, skipping auth check');
            return;
        }
        try {
            console.log('🔍 Checking auth state...');
            const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$getCurrentUser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUser"])();
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (isConfigured) {
                checkAuthState();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["AuthProvider.useEffect"], [
        isConfigured
    ]);
    const handleSignOut = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$signOut$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 109,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "IIWmZX6Nv2HSmwz6WinUcNyfMH0=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "1ec193efd933167d2f4fe76250c54c007fc786620a8c256a931f9f2692b65acb") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1ec193efd933167d2f4fe76250c54c007fc786620a8c256a931f9f2692b65acb";
    }
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_bb6d6e5d._.js.map