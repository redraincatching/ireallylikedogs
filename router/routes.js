function loadPage (component) {
    // '@' is aliased to src/components
    return () => import(/* webpackChunkName: "[request]" */
    `@/pages/${component}.vue`)}
    export default [
    { path: '/', component: loadPage('HomePage') },
    { path: '/SearchPage', component: loadPage('SearchPage') },
    { path: '/AboutUs', component: loadPage('AboutUs') },
    { path: '/AccountPage', component: loadPage('AccountPage') }
    ]