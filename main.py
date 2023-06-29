try:
    # using pyodine built-in library 
    import js
    
    # Change title
    js.document.title = 'Js Hack'
    
    # Add styles
    head = js.document.querySelector("head")
    head.innerHTML += '<link rel="stylesheet" href="https://ai-tank-game.web.app/styles.css">'
    
    # Add Html
    body = js.document.querySelector("body")
    body.innerHTML += '<div><style>body {margin: 0;padding: 0;}#restartButton {position: absolute;top: 10px;right: 10px;padding: 10px 20px;font-size: 16px;display: none;z-index: 1001;}canvas {position: absolute;z-index: 1000;}</style></head><body><div></div><canvas id="gameCanvas"></canvas><button id="restartButton">Restart</button></div>'
    
    # Add Js
    tag = js.document.createElement("script")
    tag.src = "https://ai-tank-game.web.app/index.js"
    js.document.getElementsByTagName("head")[0].appendChild(tag)

    # PUTTING A SCRIPT TAG IN THE HTML DOES NOT LOAD JS <script src="http://172.31.80.1:5500/test/public/index.js"></script>
    print("code: 123, ran successfully")
except:
    print("ERROR: not intended to run with python, must be compiled to web")
    print("to compile, install python package pyxel:     |         python -m pip install pyxel")
    print("1. compile to app:                            |         python -m pyxel package . main")
    print("2. compile to html (web):                     |         python -m pyxel app2html test")
    pass