// Validation des nombres (doivent être positifs)
function validateNumber(input) {
    const value = parseFloat(input.value);
    if (value < 0) {
        input.setCustomValidity('Veuillez entrer un nombre positif');
        input.reportValidity();
        return false;
    }
    input.setCustomValidity('');
    return true;
}

// Validation des périodes
function validatePeriod(startDateInput, endDateInput) {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    if (startDate > endDate) {
        startDateInput.setCustomValidity('La date de début doit être antérieure à la date de fin');
        endDateInput.setCustomValidity('La date de fin doit être postérieure à la date de début');
        startDateInput.reportValidity();
        return false;
    }
    
    startDateInput.setCustomValidity('');
    endDateInput.setCustomValidity('');
    return true;
}

// Ajout des écouteurs d'événements pour la validation
document.addEventListener('DOMContentLoaded', function() {
    // Validation des nombres
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateNumber(this);
        });
    });

    // Validation des périodes
    const startDateInputs = document.querySelectorAll('input[name="periode_deb"]');
    const endDateInputs = document.querySelectorAll('input[name="periode_fin"]');
    
    startDateInputs.forEach((startInput, index) => {
        const endInput = endDateInputs[index];
        
        startInput.addEventListener('change', function() {
            validatePeriod(this, endInput);
        });
        
        endInput.addEventListener('change', function() {
            validatePeriod(startInput, this);
        });
    });

    // Validation du formulaire avant soumission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            let isValid = true;
            
            // Validation des nombres
            numberInputs.forEach(input => {
                if (!validateNumber(input)) {
                    isValid = false;
                }
            });
            
            // Validation des périodes
            startDateInputs.forEach((startInput, index) => {
                const endInput = endDateInputs[index];
                if (!validatePeriod(startInput, endInput)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                event.preventDefault();
            }
        });
    });
}); 