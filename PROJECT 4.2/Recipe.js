    window.addEventListener('scroll', function() {
        var navBar = document.querySelector('.navigation');
        var scrollPosition = window.scrollY;
        var windowHeight = window.innerHeight;
        var fullHeight = document.body.scrollHeight;

        if ((scrollPosition + windowHeight) >= fullHeight) {
            navBar.style.transition = 'opacity 0.5s ease'; 
            navBar.style.opacity = '0'; 
        } else {
            navBar.style.transition = 'opacity 0.5s ease'; 
            navBar.style.opacity = '1'; 
        }

       
    });
    document.addEventListener('DOMContentLoaded', function() {
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');
        const recipes = document.querySelector('.recipes');
    
        leftArrow.addEventListener('click', () => {
            recipes.scrollBy({
                left: -400, 
                behavior: 'smooth'
            });
        });
    
        rightArrow.addEventListener('click', () => {
            recipes.scrollBy({
                left: 400, 
                behavior: 'smooth'
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const recipes = [
            { toggleName: 'ugaliNyakeToggle', ingredientsId: 'ingredients-ugali', instructionsId: 'instructions-ugali' },
            { toggleName: 'beansoup', ingredientsId: 'ingredients-beansoup', instructionsId: 'instructions-beansoup' },
            { toggleName: 'stirfryToggle', ingredientsId: 'ingredients-stirfry', instructionsId: 'instructions-stirfry' },
            { toggleName: 'nyakeToggle', ingredientsId: 'ingredients-nyake', instructionsId: 'instructions-nyake' }
        ];
    
        recipes.forEach(recipe => {
            const radioButtons = document.querySelectorAll(`input[name="${recipe.toggleName}"]`);
            const ingredientsSection = document.getElementById(recipe.ingredientsId);
            const instructionsSection = document.getElementById(recipe.instructionsId);
    
            radioButtons.forEach(button => {
                button.addEventListener('change', function() {
                    if (this.value === 'ingredients') {
                        ingredientsSection.style.display = 'block';
                        instructionsSection.style.display = 'none';
                    } else {
                        ingredientsSection.style.display = 'none';
                        instructionsSection.style.display = 'block';
                    }
                });
            });
        });
    });
    

    
    

   

   

    
   

  