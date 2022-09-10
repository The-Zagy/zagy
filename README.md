

<div align="center">
	<br>
	<a href="">
		<img src="svgedREADME.svg" width="800" height="400" alt="Click to see the source">
	</a>
	<br>
</div>

### init
`` zagy --init PROJECTNAME`` <br/>
create nodejs project based on **typescript, eslint, prettier [jest, jasmine]**
### The problem
You have a very long css file with absolute units for font size and you want to make all the font sizes **Relative** to the **html** font size
### Solution

 1. Pick a reference absolute font size from your css file (That's your reference value)
 2. Divide all other font-sizes by the value and replace its absloute unit with rem
 3. Replace the font-size in the html tag with the reference size in px (or any absolute value)
 
 ### Example
in the command line type ``zagy``
you'll see something like this
<a href="https://im.ge/i/OntPFP"><img src="https://i.im.ge/2022/09/10/OntPFP.image.png" alt="image" border="0"></a>
choose the file you want to transform and then choose the output location and the output file name
```
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
```
 after running zagy you should have something like this in the location you specified 
 ```
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
 ```
Now you should add an html tag to your output.css file with the reference value like this
 ```
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

 ```
Now all the font in your page is relative to the html tag and you can resize the font of your entire website easily

### To be added
 

 1. Other absolute units handling other than px
 2. Automatic additon of the reference font-size in the html tag

