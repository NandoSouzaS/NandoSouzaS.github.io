// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll suave para os links do menu
    const menuLinks = document.querySelectorAll('nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll suave até a seção
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Animação de entrada dos elementos quando aparecem na tela
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplica animação aos elementos das seções
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Inicialização do EmailJS
    (function() {
        emailjs.init("izXfm7Gj8A1Jz6NLw"); // Substitua pela sua chave pública do EmailJS
    })();

    // Elementos do modal
    const modal = document.getElementById('feedbackModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeBtn = document.querySelector('.close');
    const submitBtn = document.getElementById('submitBtn');

    // Fechar modal
    closeBtn.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Restaura scroll
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto'; // Restaura scroll
        }
    }

    // Função para mostrar mensagem no modal
    function showMessage(message, isSuccess = true) {
        modalMessage.innerHTML = message;
        modalMessage.className = isSuccess ? 'success-message' : 'error-message';
        modal.style.display = "block";
        document.body.style.overflow = 'hidden'; // Previne scroll
    }

    // Validação e envio do formulário de contato
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();
        
        if (nome === '' || email === '' || mensagem === '') {
            showMessage('Por favor, preencha todos os campos!', false);
            return;
        }
        
        // Validação de email simples
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Por favor, insira um email válido!', false);
            return;
        }
        
        // Mostrar loading no botão
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Template de parâmetros para o EmailJS
        const templateParams = {
            from_name: nome,
            from_email: email,
            message: mensagem,
            to_name: 'Fernando Souza'
        };
        
        // Enviar email usando EmailJS
        emailjs.send('service_wb8p6j9', 'template_36v1oet', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.');
                document.getElementById('contactForm').reset();
            }, function(error) {
                console.log('FAILED...', error);
                showMessage('Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato diretamente pelo email: fernando.souza.ctt@gmail.com', false);
            })
            .finally(function() {
                // Remover loading do botão
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Enviar';
                submitBtn.disabled = false;
            });
    });

    // Efeito de destaque no menu ativo durante o scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Efeito de digitação no título (opcional)
    const titles = document.querySelectorAll('h1');
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Inicia a animação quando a seção aparece
        const titleObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    titleObserver.unobserve(entry.target);
                }
            });
        });
        titleObserver.observe(title);
    });
}); 