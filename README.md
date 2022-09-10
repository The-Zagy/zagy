<style>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
.main-header{
font-family: 'Great Vibes', cursive;
font-size:200px;
width:fit-content;
margin:auto;
background: rgb(91,207,250);
background: linear-gradient(90deg, rgba(91,207,250,1) 0%, rgba(91,207,250,1) 22%, rgba(245,170,185,1) 23%, rgba(245,170,185,1) 42%, rgba(254,254,254,1) 44%, rgba(232,232,232,1) 61%, rgba(245,170,185,1) 62%, rgba(245,170,185,1) 80%, rgba(91,207,250,1) 81%, rgba(91,207,250,1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<h1 class="main-header">zagy</h1>

## Installation
``npm i -g badcss``

## usage
- edit bad css files => Just type ``zagy`` in the terminal and a nice interface will appear to ask you some question like where is the file you want to edit and where do you want the output to be
- Init nodejs project => Type ``zagy --init <foldername> [-t <jest|jasmine>]``<br/>
<div style="display:flex; justify-content:space-between;">
<div>
<code>zagy --init sample -t jasmine</code>
<pre style="display:inline-block; background-color:transparent;">
<em>#Jasmine</em>
.
└── app/
    ├── dist
    ├── node_modules
    ├── spec/
    │   └── support/
    │       └── jasmine.json
    ├── src/
    │   ├── __tests__/
    │   │   ├── helpers/
    │   │   │   └── reporter.ts
    │   │   └── indexSpec.ts
    │   └── index.ts
    ├── .eslintrc
    ├── .gitignore
    ├── .prettierrc
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
</pre>
</div>
<div>
<code>zagy --init sample -t jest</code><br/>
<em>or</em>&nbsp;
<code>zagy --init sample</code>
<pre style="display:inline-block; background-color:transparent;">
<em>#Jest</em>
.
└── app/
    ├── dist
    ├── node_modules
    ├── src/
    │   ├── __tests__/
    │   │   └── index.spec.ts
    │   └── index.ts
    ├── .eslintrc
    ├── .gitignore
    ├── .prettierrc
    ├── jest.config.json
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
</pre>
</div>
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