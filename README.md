# zagy
## usage
- edit bad css files 
- init nodejs project

### init
``` zagy --init PROJECTNAME ```
create nodejs project based on **typescript,eslint,prettier[,jest,jasmine]**
### The problem
You have a very long css file with absolute units for font size and you want to make all the font sizes **Relative** to the **html** font size
### Solution

 1. Pick a reference absolute font size from your css file (That's your reference value)
 2. Divide all other font-sizes by the value and replace its absloute unit with rem
 3. Replace the font-size in the html tag with the reference size in px (or any absolute value)
 
 ### Example
	 

    #absoluteFontSizes.css
    div{...
	    font-size:15px;
	    }
	.classname{...
		font-size:30px;
		}
	h.classname{
		...
		font-size:60px;
		}
in the command line type ``zagy --path examplePath\absoluteFontSize.css --ref 30 --target examplePath\``
 and you should have another css file called "output.css" in the same folder of absoluteFontSize.css file

    #output.css
        div{...
	    font-size: 0.5 rem;
	    }
	.classname{...
		font-size: 1 rem;
		}
	h.classname{
		...
		font-size: 2 rem;
		}
Now you should add an html tag to your output.css file with the reference value like this

    #output.css
	    html{
	    font-size:30px;
	    }
        div{...
	    font-size: 0.5 rem;
	    }
	.classname{...
		font-size: 1 rem;
		}
	h.classname{
		...
		font-size: 2 rem;
		}
Now all the font in your page is relative to the html tag and you can resize the font of your entire website easily

### To be added
 

 1. Other absolute units handling other than px
 2. Automatic additon of the reference font-size in the html tag
 3. Nicer interface in the cli
 4. The ability to name your output css file
