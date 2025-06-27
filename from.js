document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Show loading state
            const submitBtn = registrationForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            
            try {
                // Collect form data
                const formData = new FormData(registrationForm);
                const data = {};
                formData.forEach((value, key) => data[key] = value);
                
                // Convert checkbox to boolean
                data.persetujuan = registrationForm.querySelector('#persetujuan').checked;
                
                // Send data to server
                const response = await fetch('process_pendaftaran.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.message || 'Terjadi kesalahan');
                }
                
                if (result.success) {
                    // Redirect to success page
                    window.location.href = `pendaftaran-sukses.html?id=${result.registration_id}`;
                } else {
                    showFormError(result.message);
                }
            } catch (error) {
                showFormError(error.message);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        // Validate name
        const nama = document.getElementById('nama');
        if (nama.value.trim() === '') {
            showError(nama, 'Nama lengkap harus diisi');
            isValid = false;
        } else {
            showSuccess(nama);
        }
        
        // Validate email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            showError(email, 'Email harus diisi');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, 'Email tidak valid');
            isValid = false;
        } else {
            showSuccess(email);
        }
        
        // Validate phone
        const telepon = document.getElementById('telepon');
        const phoneRegex = /^[0-9]{10,13}$/;
        if (telepon.value.trim() === '') {
            showError(telepon, 'Nomor telepon harus diisi');
            isValid = false;
        } else if (!phoneRegex.test(telepon.value)) {
            showError(telepon, 'Nomor telepon tidak valid (10-13 digit)');
            isValid = false;
        } else {
            showSuccess(telepon);
        }
        
        // Validate birth date
        const tanggal_lahir = document.getElementById('tanggal_lahir');
        if (tanggal_lahir.value === '') {
            showError(tanggal_lahir, 'Tanggal lahir harus diisi');
            isValid = false;
        } else {
            // Check if age is at least 12 years
            const birthDate = new Date(tanggal_lahir.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 12) {
                showError(tanggal_lahir, 'Usia minimal 12 tahun');
                isValid = false;
            } else {
                showSuccess(tanggal_lahir);
            }
        }
        
        // Validate agreement checkbox
        const persetujuan = document.getElementById('persetujuan');
        if (!persetujuan.checked) {
            showError(persetujuan, 'Anda harus menyetujui syarat dan ketentuan');
            isValid = false;
        } else {
            showSuccess(persetujuan);
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        formGroup.classList.add('error');
        
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('small');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
    }
    
    function showSuccess(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        formGroup.classList.remove('error');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function showFormError(message) {
        const errorContainer = document.getElementById('form-error');
        if (!errorContainer) {
            const container = document.createElement('div');
            container.id = 'form-error';
            container.className = 'alert alert-danger';
            registrationForm.prepend(container);
        }
        
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
});