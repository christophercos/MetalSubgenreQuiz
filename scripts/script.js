$(function() {
    // object for all the default subgenre scores
    var tally = {
        nuMetal: 0,
        thrashMetal: 0,
        hardRock: 0,
        hairMetal: 0,
        folkMetal: 0
    }

    //object for all of the quiz results content
    var results = {
        nuMetal: {
            name: "nu Metal",
            description: "You're Nu Metal! You're not afraid to try new things in life and combine tastes that others (with more traditional views) find... well, unacceptable and reprehensible. You don't let elitists bring you down, because you push for innovation. Do the thing. Haters will hate.",
            image: "assets/018-lighter.png"
        },

        thrashMetal: {
            name: "thrash Metal",
            description: "You're Thrash Metal! Fuel, fire, that which you desire. You're all about speed and power. Traditional in taste (sometimes to a fault), but time-tested and effective. Go ride a motorcycle.",
            image: "assets/040-electric-guitar.png"
        },

        hardRock: {
            name: "hard Rock",
            description: "You're Hard Rock! You take steps toward the future while always keeping history in mind. You generally stick to the classics in all aspects of life, whether it's literature, movies, or music. You were probably voted 'Most Likely To Claim To Be Born In The Wrong Generation' in high school.",
            image: "assets/031-guitar-pick.png"
        },

        hairMetal: {
            name: "hair Metal",
            description: "You're Hair Metal! You live for the flashy, exuberant, and over-the-top. If there's something that needs to be said, you scream it. Actually, literally scream it. Seriously, you scream in public. You're probably the type of person to hang out in a coffee shop with no shirt and glitter on your face. It's fine. You do you.",
            image: "assets/002-lips.png"
        },

        folkMetal: {
            name: "folk Metal",
            description: "You're Folk Metal! Stoic, strong, and proud. You'll get the job done, and leave no stone unturned. If it wasn't for the pressure of today's society, you'd be living in a tiny home in a forest somewhere living off the land with a cat named Harvey. Some kind of people-cat name, at least.",
            image: "assets/016-violin.png"
        }
    }

    //smooth scrolls to the given target
    var smoothScroll = function(target) {
        var $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function() {
            window.location.hash = target;
        });
    }

    //to get the images in each question section to appear upon smooth-scrolling to that section
    $("img.lazy").lazyload({
        effect: "fadeIn",
    });

    //smooth scroll effect for "Take The Quiz" button only    
    $('#takeQuiz').on('click', function(e) {
        e.preventDefault();
        var target = $(this).data('hash');
        smoothScroll(target);
    });

    //function that will tally the scores for each subgenre after each question is answered
    $('form').on('submit', function(e) {
        //to prevent page from refreshing every time a form is submitted (i.e., when question is answered)
        e.preventDefault();
        //when check off radio button, record and store subgenre name in a variable
        var answer = $(this).find('input:radio:checked').attr('data-subgenre');
        //if question is answered and submitted, the tally will increment corresponding subgenre, and the "Next" button will be disabled
        if (answer) {
            tally[answer]++;
            $(this).find('input:submit').attr('disabled', true);
            //smooth scroll effect for submit inputs in each question section only   
            var target = $(this).find('input:submit').data('hash');
            smoothScroll(target);
        } else {
            $(this).find('.warning').text('Pick an answer!');
        }
    });

    //function to convert tally object into an array and arrange from highest to lowest score
    $('#finalSubmit').on('click', function(e) {
        e.preventDefault();
        var answers = $('form').find('input:radio:checked');
        if (answers.length === 5) {
            var scoresKeys = Object.keys(tally);
            var scoresArray = scoresKeys.map(function(key) {
                return {
                    value: key,
                    score: tally[key]
                }
            });
            scoresArray.sort(function(a, b) {
                return b.score - a.score;
            });
            console.log(scoresArray);
            //Present the string of the winning genre as well as points allotted to that genre
            var winningScore = scoresArray[0].score;
            var winningGenre = scoresArray[0].value;
            //converting the winning genre to a variable accessible by the global results object
            var resultingWinner = results[winningGenre];

            //select the template in the HTML
            var resultsTemplate = $('#resultsTemplate').html();
            //pass the template into the handlebars compile() method to allow handlebars to work its magic
            var template = Handlebars.compile(resultsTemplate);
            //pass our data into the handlebars template
            var finalTemplate = template(resultingWinner);
            //append the data to the quiz results section

            //smooth scroll only if user completes quiz
            var target = $('#quizResults');
            smoothScroll(target);
            $('.resultsWrapper').html(finalTemplate);
            //show quiz results section
        } else {
            $('.secondWarning').text('Please complete all questions to see your results!');
        }
    });

    //to refresh and scroll back up to the top of page if want to do quiz again
    $('a.restart').on('click', function() {
        location.reload();
        $('html,body').scrollTop(0);
    });

    //THE BELOW WORKS FOR TWITTER SHARING
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
        };

        return t;
    }(document, "script", "twitter-wjs"));
});