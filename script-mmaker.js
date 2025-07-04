// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    return urlParams.get(name);
}

// Función para autocompletar campos
function autocompleteFields() {

    // Obtener parámetros de la URL
    const username = getUrlParameter('username');
    const email = getUrlParameter('email');
    const phone = getUrlParameter('phone');

    // Autocompletar username
    const usernameField = document.getElementById('register_username');
    if (usernameField && username) {
        usernameField.value = username;
        // Disparar evento para activar validaciones
        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
        usernameField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Autocompletar email
    const emailField = document.querySelector('input[name="email"]');
    if (emailField && email) {
        emailField.value = email;
        emailField.dispatchEvent(new Event('input', { bubbles: true }));
        emailField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Autocompletar phone
    const phoneField = document.querySelector('input[name="phone"]');
    if (phoneField && phone) {
        phoneField.value = phone;
        phoneField.dispatchEvent(new Event('input', { bubbles: true }));
        phoneField.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

// Ejecutar inmediatamente (apto consola navegador)
autocompleteFields();

// También ejecutar cuando la página esté completamente cargada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autocompleteFields);
} else {
    // Si ya está cargada, ejecutar después de un pequeño delay para asegurar que los campos existan
    setTimeout(autocompleteFields, 100);
}
