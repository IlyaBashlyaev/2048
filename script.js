var userAgent = navigator.userAgent,
    canBePlayed, cellBgColors, canBeOverflowed = true
userAgent.includes('Windows') || userAgent.includes('Macintosh') ? canBePlayed = true : canBePlayed = false

if (userAgent.includes('Android') || userAgent.includes('iPhone OS')) {
    document.body.style.overflowY = 'hidden'
    canBeOverflowed = false
}

function setSquareColors() {
    if (document.body.className == '') {
        cellBgColors = {
            2: '#eee4da', 4: '#ede0c8', 8: '#f2b179',
            16: '#f59563', 32: '#f67c5f', 64: '#f65e3b',
            128: '#edcf72', 256: '#edcc61', 512: '#edc850',
            1024: '#ceaf3d', 2048: '#d1aa2c'
        }
    }

    else if (document.body.className == 'dark') {
        cellBgColors = {
            2: '#4a4846', 4: '#4f4d4b', 8: '#6e5032',
            16: '#73432a', 32: '#7d3828', 64: '#7d2918',
            128: '#968040', 256: '#7a6930', 512: '#9c7b13',
            1024: '#997d17', 2048: '#ad8810'
        }
    }

    else if (document.body.className == 'colorful') {
        cellBgColors = {
            2: '#eef4e8', 4: '#ddedc8', 8: '#aed582',
            16: '#8ec94b', 32: '#6faa3c', 64: '#4c9430',
            128: '#018c79', 256: '#02a8b4', 512: '#191996',
            1024: '#c88116', 2048: '#8f8f21'
        }
    }
}
setSquareColors()

var dirs = ['up', 'right', 'down', 'left'],
    currentSquaresArray, currentPlayerSquaresArray,
    bestScore = localStorage.getItem('best-score'),
    themeIndex = parseInt(localStorage.getItem('theme-index')),
    canBeMoved = true,
    isUndo = true,
    lastThemeIndex = 0,
    lastModeIndex = 0,
    aiMoving = false,
    angle = 45,
    filledSquares, aiFilledSquares,
    score, aiScore, aiArena,
    startedSwipe, gameOvered,
    rotateGradient

if (!bestScore)
    bestScore = 0

if (themeIndex > 0)
    changeTheme(themeIndex)

var moveSound = new Audio()
moveSound.src = 'music/move.wav'
moveSound.volume = .2

var victorySound = new Audio()
victorySound.src = 'music/victory.mp3'
victorySound.volume = .2

if (canBeOverflowed) {
    if (lastModeIndex == 0)
        document.body.style.overflowY = 'hidden'
    else if (lastModeIndex == 1)
        document.body.style.removeProperty('overflow-y')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function startGame() {
    localStorage.setItem('current-squares-array', '[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]')

    const sections = document.querySelectorAll('section')
    sections.forEach(section => {
        if (section.classList.contains('blured'))
            section.classList.remove('blured')
    })

    canBeMoved = true
    score = 0
    aiScore = 0
    filledSquares = []
    aiFilledSquares = []
    aiArena = []
    gameOvered = [false, false]

    if (userAgent.includes('Windows'))
        canBePlayed = true

    const scoreValue = document.querySelector('.score-value')
    scoreValue.innerText = '0'

    const squares = document.querySelectorAll('.square')
    squares.forEach(square => square.remove())

    const gameOverAlert = document.querySelector('.game-over-alert')
    gameOverAlert.classList.remove('active')

    if (lastModeIndex == 0) {
        const undoBlock = document.querySelector('.undo-block')
        undoBlock.style.opacity = '1'
        isUndo = true
    }

    createSquare(0)
    if (lastModeIndex == 1)
        createSquare(1)

    if (lastModeIndex == 0) {
        const bestScoreEl = document.querySelectorAll('.score-value')[1]
        bestScoreEl.innerText = bestScore
    }

    else if (lastModeIndex == 1) {
        const aiScoreEl = document.querySelectorAll('.score-value')[1]
        aiScoreEl.innerText = '0'
    }
}
startGame()

function setScale(attempts = 1) {
    const main = document.querySelector('main'),
          leftSide = document.querySelector('.left-side'),
          rightSide = document.querySelector('.right-side'),
          settingsMenuContent = document.querySelector('.settings-menu-content'),
          settingsMenuButton = document.querySelector('.settings-menu-button'),
          settingsMenuButtonActive = document.querySelector('.settings-menu-button.active'),
          categoryBlocks = document.querySelectorAll('.category-block > div')
    
    if (settingsMenuContent.scrollHeight > window.innerHeight) {
        if (settingsMenuButtonActive) {
            settingsMenuButtonActive.style.width = '240px'
            const innerSettingsMenuButton = settingsMenuButtonActive.querySelector('div')
            innerSettingsMenuButton.style.width = '240px'
        }

        else {
            settingsMenuButton.style.width = '80px'
            const innerSettingsMenuButton = settingsMenuButton.querySelector('div')
            innerSettingsMenuButton.style.width = '80px'
        }

        categoryBlocks.forEach(categoryBlock => {
            categoryBlock.style.width = '240px'
        })
    }

    else {
        if (settingsMenuButtonActive) {
            settingsMenuButtonActive.style.width = '250px'
            const innerSettingsMenuButton = settingsMenuButtonActive.querySelector('div')
            innerSettingsMenuButton.style.width = '250px'
        }

        else {
            settingsMenuButton.style.width = '80px'
            const innerSettingsMenuButton = settingsMenuButton.querySelector('div')
            innerSettingsMenuButton.style.width = '80px'
        }

        categoryBlocks.forEach(categoryBlock => {
            categoryBlock.style.width = '250px'
        })
    }
    
    for (var attempt = 0; attempt < attempts; attempt++) {
        if (window.innerHeight < 776) {
            var coefficient = window.innerHeight / 776 - 0.01
            main.style.transformOrigin = `${main.offsetWidth / 2}px ${200 * coefficient}px`
            main.style.transform = `scale(${coefficient})`
            document.body.style.height = main.offsetHeight * coefficient + 'px'
        }
    
        else {
            var coefficient = 1
            main.style.transform = 'scale(1)'
            document.body.style.height = '100%'
        }

        if (lastModeIndex == 0) {
            if (window.innerWidth < 625) {
                for (var index = 0; index < 1; index += 0.3) {
                    if (window.innerWidth < 625 * (coefficient - index)) {
                        main.style.transform = `scale(
                            ${coefficient - index - 0.3}
                        )`
                    }
                }
            }
        }

        else if (lastModeIndex == 1) {
            if (window.innerWidth < 1270) {
                document.body.style.height = window.innerHeight + 'px'

                if (window.innerHeight < 1422) {
                    for (var index = 0; index < 1; index += 0.45) {
                        if (window.innerHeight < 1422 * (coefficient - index)) {
                            main.style.transform = `scale(
                                ${coefficient - index - 0.45}
                            )`
                        }
                    }
                }
            }
        }
    
        if (window.innerWidth < 1025 * coefficient) {
            leftSide.style.display = 'none'
            rightSide.style.display = 'none'
        }
    
        else {
            leftSide.style.display = 'block'
            rightSide.style.display = 'block'
        }
    }
}
setScale(2)

function isFilled(playerIndex) {
    const section = document.querySelectorAll('section')[playerIndex],
          squares = section.querySelector('.squares'),
          cells = section.querySelectorAll('.cell')

    for (var index = 0; index < cells.length; index++) {
        const cell = cells[index]
        var coords = JSON.parse(cell.getAttribute('coords'))
        const square = squares.querySelector(`[coords="[${coords}]"]`)
        
        if (coords[0] > 0) {
            const relativeSquare = squares.querySelector(`[coords="[${coords[0] - 1},${coords[1]}]"]`)
            if (!square || !relativeSquare)
                return false

            else if (square && relativeSquare) {
                if (relativeSquare.innerText == square.innerText)
                    return false
            }
        }

        if (coords[1] > 0) {
            const relativeSquare = squares.querySelector(`[coords="[${coords[0]},${coords[1] - 1}]"]`)
            if (!square || !relativeSquare)
                return false

            else if (square && relativeSquare) {
                if (relativeSquare.innerText == square.innerText)
                    return false
            }
        }

        if (coords[0] < 3) {
            const relativeSquare = squares.querySelector(`[coords="[${coords[0] + 1},${coords[1]}]"]`)
            if (!square || !relativeSquare)
                return false

            else if (square && relativeSquare) {
                if (relativeSquare.innerText == square.innerText)
                    return false
            }
        }

        if (coords[1] < 3) {
            const relativeSquare = squares.querySelector(`[coords="[${coords[0]},${coords[1] + 1}]"]`)
            if (!square || !relativeSquare)
                return false

            else if (square && relativeSquare) {
                if (relativeSquare.innerText == square.innerText)
                    return false
            }
        }
    }

    return true
}

function createSquare(playerIndex) {
    const squares = document.querySelectorAll('.squares')[playerIndex]

    for (var attempt = 0; attempt < 100; attempt++) {
        var coordsX = Math.round(Math.random() * 3),
            coordsY = Math.round(Math.random() * 3),
            coords = JSON.stringify([coordsX, coordsY])

        if (
            playerIndex == 0 && !filledSquares.includes(coords) ||
            playerIndex == 1 && !aiFilledSquares.includes(coords)
        ) {
            if (playerIndex == 0)
                filledSquares.push(coords)
            else if (playerIndex == 1)
                aiFilledSquares.push(coords)

            const allSquares = squares.querySelectorAll('.square')
                    square = document.createElement('div')
            
            var squaresArray = [],
                squareText
                
            allSquares.forEach(square => {
                squaresArray.push(parseInt(square.innerText))
            })

            const maxNum = Math.max.apply(Math, squaresArray)
            if (maxNum >= 128) {
                if (maxNum >= 512)
                    squareText = 2 ** (Math.round(Math.random() * 2) + 1)
                
                else
                    squareText = 2 ** (Math.round(Math.random()) + 1)
            }

            else
                squareText = '2'

            square.className = 'square'
            square.innerText = squareText
            square.setAttribute('coords', coords)

            square.style = `
                transition: top .127s, left .127s, background-color 1s, border-radius 1s, color 1s;
                background-color: ${cellBgColors[squareText]};
                top: ${coordsY * 152 + 9}px;
                left: ${coordsX * 152 + 9}px;`
            
            if (document.body.className == '') {
                var log = Math.log(squareText) / Math.log(2)
                log < 3 ? square.style.color = '#776e65' : square.style.color = '#f9f6f2'
            }

            else if (document.body.className == 'dark')
                square.style.color = '#f9f6f2'
            
            else if (document.body.className == 'colorful') {
                var log = Math.log(squareText) / Math.log(2)
                log < 3 ? square.style.color = '#515151' : square.style.color = '#f9f6f1'
            }

            squares.appendChild(square)
            attempt = 100
        }

        else if (attempt == 99) {
            if (isFilled(playerIndex)) {
                const undoBlock = document.querySelector('.undo-block'),
                      aiSection = document.querySelector('.ai-section'),
                      gameOverAlert = document.querySelector('.game-over-alert'),
                      gameOverBg = gameOverAlert.querySelector('.game-over-bg'),
                      gameOverTitle = gameOverAlert.querySelector('.game-over-title')

                undoBlock.style.opacity = '0'
                isUndo = false

                if (lastModeIndex == 1) {
                    aiSection.classList.add('blured')

                    if (aiScore > score) {
                        gameOverBg.style.backgroundColor = '#000'
                        gameOverTitle.innerText = 'Game over!'
                        gameOverAlert.classList.add('active')
                
                        if (canBePlayed) {
                            const defeatSound = new Audio()
                            defeatSound.volume = .2
                            defeatSound.src = `music/defeat/defeat${Math.round(Math.random() * 6) + 1}.mp3`
                            defeatSound.play()
                            canBePlayed = false
                        }
                    }

                    else {
                        gameOverBg.style.backgroundColor = '#e1c864'
                        gameOverTitle.innerText = 'You win!'
                        gameOverAlert.classList.add('active')

                        if (canBePlayed) {
                            victorySound.play()
                        }
                    }
                }

                else if (playerIndex == 0 && lastModeIndex == 0) {
                    gameOverBg.style.backgroundColor = '#000'
                    gameOverTitle.innerText = 'Game over!'
                    gameOverAlert.classList.add('active')
            
                    if (canBePlayed) {
                        const defeatSound = new Audio()
                        defeatSound.volume = .2
                        defeatSound.src = `music/defeat/defeat${Math.round(Math.random() * 6) + 1}.mp3`
                        defeatSound.play()
                    }
                }
            }
        }
    }
}

function checkAiPos() {
    var aiSection = document.querySelector('.ai-section'),
        squares = aiSection.querySelector('.squares')
        rows = aiSection.querySelectorAll('.row')
    
    aiArena = []
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        aiArena.push([])
        var row = rows[rowIndex],
            cells = row.querySelectorAll('.cell')

        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            var cell = cells[cellIndex],
                cellCoords = cell.getAttribute('coords'),
                square = squares.querySelector(`[coords="${cellCoords}"]`)
            square ? aiArena[rowIndex].push(parseInt(square.innerText)) : aiArena[rowIndex].push('')
        }
    }

    var simpleAiArena = []
    for (rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            var arenaItem = aiArena[rowIndex][cellIndex]
            if (arenaItem)
                simpleAiArena.push(arenaItem)
        }
    }
    simpleAiArena = JSON.stringify(simpleAiArena)

    var lengthArray = []
    for (var dirIndex = 0; dirIndex < 4; dirIndex++) {
        moveSquares(
            dirs[dirIndex],
            playerIndex = 1,
            key = 'analyze'
        )

        if (JSON.stringify(currentSquaresArray) != simpleAiArena) {
            var length = currentSquaresArray.length
            lengthArray.push(length)
        }

        else {
            lengthArray.push(17)
        }

        var squares = aiSection.querySelector('.squares'),
            allSquares = squares.querySelectorAll('.square')
        allSquares.forEach(square => square.remove())

        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            var row = rows[rowIndex],
                cells = row.querySelectorAll('.cell')
            
            for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                var num = aiArena[rowIndex][cellIndex]
    
                if (num) {
                    var square = document.createElement('div'),
                        coords = `[${cellIndex},${rowIndex}]`
                    
                    square.className = 'square'
                    square.innerText = num
                    square.setAttribute('coords', coords)
    
                    square.style = `
                        transition: top .127s, left .127s, background-color 1s, border-radius 1s, color 1s;
                        background-color: ${cellBgColors[num]};
                        top: ${rowIndex * 152 + 9}px;
                        left: ${cellIndex * 152 + 9}px;
                        animation: none;`
                    
                    if (document.body.className == '') {
                        var log = Math.log(num) / Math.log(2)
                        log < 3 ? square.style.color = '#776e65' : square.style.color = '#f9f6f2'
                    }
    
                    else if (document.body.className == 'dark')
                        square.style.color = '#f9f6f2'
                    
                    else if (document.body.className == 'colorful') {
                        var log = Math.log(num) / Math.log(2)
                        log < 3 ? square.style.color = '#515151' : square.style.color = '#f9f6f1'
                    }
    
                    if (num >= 128 && document.body.className != 'colorful') {
                        var log = Math.log(num) / Math.log(2),
                            shadowAlpha = ((log - 7) * 5 + 14) / 100,
                            insetAlpha = ((log - 7) * 8 + 24) / 100
                        
                        if (document.body.className == 'dark')
                            insetAlpha = 0 
    
                        square.style.boxShadow = `
                            0 0 30px 10px rgba(243, 215, 116, ${shadowAlpha}),
                            inset 0 0 0 1px rgba(255, 255, 255, ${insetAlpha})`
                    }
    
                    if (String(num).length == 3)
                        square.style.fontSize = '60px'
                    if (String(num).length == 4)
                        square.style.fontSize = '50px'
                    squares.appendChild(square)
                }
            }
        }
    }

    var minLength = Math.min.apply(Math, lengthArray),
        minLengthIndex = lengthArray.indexOf(minLength)

    moveSquares(
        dirs[minLengthIndex],
        playerIndex = 1,
        key = 'move'
    )
}

async function moveSquares(dir, playerIndex = 0, key = 'move') {
    var section = document.querySelectorAll('section')[playerIndex]
    canBeMoved = false

    if (!isUndo && lastModeIndex == 0) {
        const undoBlock = document.querySelector('.undo-block'),
              undo = undoBlock.querySelector('svg')

        undoBlock.style.opacity = '1'
        undo.style.transform = 'rotate(720deg)'
        isUndo = true
    }

    if (dir == 'left' || dir == 'right') {
        const rows = section.querySelectorAll('.row')
        rows.forEach(row => {
            var cells = row.querySelectorAll('.cell'),
                coordsX
                
            dir == 'left' ? coordsX = -1 : coordsX = 4
            if (dir == 'right')
                cells = [...cells].reverse()

            cells.forEach(cell => {
                var cellCoords = cell.getAttribute('coords'),
                    squares = section.querySelector('.squares'),
                    square = squares.querySelector(`[coords="${cellCoords}"]`)

                if (square) {
                    var jsonCoords = JSON.parse(cellCoords),
                        index

                    if (playerIndex == 0)
                        index = filledSquares.indexOf(cellCoords)
                    else if (playerIndex == 1)
                        index = aiFilledSquares.indexOf(cellCoords)

                    if (dir == 'left' && coordsX == -1) {
                        var newCoords = JSON.stringify([
                            0, jsonCoords[1]
                        ])

                        var newSquare = squares.querySelector(`[coords="${newCoords}"]`)
                        square.style.top = jsonCoords[1] * 152 + 9 + 'px'

                        if (newSquare) {
                            if (square.innerText != newSquare.innerText) {
                                var newCoords = JSON.stringify([
                                    1, jsonCoords[1]
                                ])

                                square.style.left = '161px'
                            }
                            
                            else
                                square.style.left = '9px'
                        }

                        else
                            square.style.left = '9px'
                    }

                    else if (dir == 'right' && coordsX == 4) {
                        var newCoords = JSON.stringify([
                            3, jsonCoords[1]
                        ])

                        var newSquare = squares.querySelector(`[coords="${newCoords}"]`)
                        square.style.top = jsonCoords[1] * 152 + 9 + 'px'

                        if (newSquare) {
                            if (square.innerText != newSquare.innerText) {
                                var newCoords = JSON.stringify([
                                    2, jsonCoords[1]
                                ])

                                square.style.left = '313px'
                            }
                            
                            else
                                square.style.left = '465px'
                        }

                        else
                            square.style.left = '465px'
                    }

                    else {
                        var newCoords = JSON.stringify([
                            coordsX, jsonCoords[1]
                        ])

                        var newSquare = squares.querySelector(`[coords="${newCoords}"]`)
                        square.style.top = jsonCoords[1] * 152 + 9 + 'px'

                        if (newSquare) {
                            if (square.innerText != newSquare.innerText) {
                                var newCoordsX
                                dir == 'left' ? newCoordsX = coordsX + 1 : newCoordsX = coordsX - 1

                                var newCoords = JSON.stringify([
                                    newCoordsX, jsonCoords[1]
                                ])

                                square.style.left = newCoordsX * 152 + 9 + 'px'
                            }
                            
                            else
                                square.style.left = coordsX * 152 + 9 + 'px'
                        }

                        else
                            square.style.left = coordsX * 152 + 9 + 'px'
                    }
                    
                    if (playerIndex == 0 && key == 'move') {
                        filledSquares.splice(index, 1)
                        filledSquares.push(newCoords)
                    }

                    else if (playerIndex == 1 && key == 'move') {
                        aiFilledSquares.splice(index, 1)
                        aiFilledSquares.push(newCoords)
                    }

                    square.setAttribute('coords', newCoords)
                    dir == 'left' ? coordsX++ : coordsX--
                }
            })
        })
    }

    else if (dir == 'up' || dir == 'down') {
        var columns = []

        for (var index = 1; index < 5; index++) {
            var column = section.querySelectorAll(`.cell-block:nth-child(${index})`)
            columns.push(column)
        }

        columns.forEach(column => {
            var coordsY
            dir == 'up' ? coordsY = -1 : coordsY = 4

            if (dir == 'down')
                column = [...column].reverse()

            column.forEach(cell => {
                var cell = cell.querySelector('.cell'),
                    cellCoords = cell.getAttribute('coords'),
                    squares = section.querySelector('.squares'),
                    square = squares.querySelector(`[coords="${cellCoords}"]`)

                if (square) {
                    var jsonCoords = JSON.parse(cellCoords),
                        index
                    
                    if (playerIndex == 0)
                        index = filledSquares.indexOf(cellCoords)
                    else if (playerIndex == 1)
                        index = aiFilledSquares.indexOf(cellCoords)

                    if (dir == 'up' && coordsY == -1) {
                        var newCoords = JSON.stringify([
                            jsonCoords[0], 0
                        ])

                        var newSquare = squares.querySelector(`[coords="${newCoords}"]`)
                        square.style.left = jsonCoords[0] * 152 + 9 + 'px'

                        if (newSquare) {
                            if (square.innerText != newSquare.innerText) {
                                var newCoords = JSON.stringify([
                                    jsonCoords[0], 1
                                ])

                                square.style.top = '161px'
                            }
                            
                            else
                                square.style.top = '9px'
                        }

                        else
                            square.style.top = '9px'
                    }

                    else if (dir == 'down' && coordsY == 4) {
                        var newCoords = JSON.stringify([
                            jsonCoords[0], 3
                        ])

                        var newSquare = squares.querySelector(`[coords="${newCoords}"]`)
                        square.style.left = jsonCoords[0] * 152 + 9 + 'px'

                        if (newSquare) {
                            if (square.innerText != newSquare.innerText) {
                                var newCoords = JSON.stringify([
                                    jsonCoords[0], 1
                                ])

                                square.style.top = '313px'
                            }
                            
                            else
                                square.style.top = '465px'
                        }

                        else
                            square.style.top = '465px'
                    }

                    else {
                        var newCoords = JSON.stringify([
                            jsonCoords[0], coordsY
                        ])

                        var newSquare = squares.querySelector(`[coords="${newCoords}"]`)
                        square.style.left = jsonCoords[0] * 152 + 9 + 'px'

                        if (newSquare) {
                            if (square.innerText != newSquare.innerText) {
                                var newCoordsY
                                dir == 'up' ? newCoordsY = coordsY + 1 : newCoordsY = coordsY - 1

                                var newCoords = JSON.stringify([
                                    jsonCoords[0], newCoordsY
                                ])

                                square.style.top = newCoordsY * 152 + 9 + 'px'
                            }
                            
                            else
                                square.style.top = coordsY * 152 + 9 + 'px'
                        }

                        else
                            square.style.top = coordsY * 152 + 9 + 'px'
                    }
                    
                    if (playerIndex == 0 && key == 'move') {
                        filledSquares.splice(index, 1)
                        filledSquares.push(newCoords)
                    }

                    else if (playerIndex == 1 && key == 'move') {
                        aiFilledSquares.splice(index, 1)
                        aiFilledSquares.push(newCoords)
                    }

                    square.setAttribute('coords', newCoords)
                    dir == 'up' ? coordsY++ : coordsY--
                }
            })
        })
    }

    if (canBePlayed)
        moveSound.play()

    if (key == 'move')
        await sleep(127)

    currentSquaresArray = checkSquaresPos(playerIndex, key)
    if (key == 'analyze')
        return

    createSquare(playerIndex)
    canBeMoved = true

    const gameOverAlert = document.querySelector('.game-over-alert'),
          settingsMenu = document.querySelector('.settings-menu')

    if (gameOverAlert.classList.contains('active') ||
        settingsMenu.classList.contains('active'))
        canBeMoved = false
}

function checkSquaresPos(_playerIndex_, key) {
    const sections = document.querySelectorAll('section')
    
    if (key == 'move')
        var playerIndex = 0
    else if (key == 'analyze')
        var playerIndex = 1
    if (key == 'analyze')
        currentSquaresArray = []

    for (playerIndex; playerIndex < lastModeIndex + 1; playerIndex++) {
        var section = sections[playerIndex],
            squares = section.querySelector('.squares')
            cells = section.querySelectorAll('.cell')
            
        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            var coords = cells[cellIndex].getAttribute('coords'),
                squareArray = squares.querySelectorAll(`[coords="${coords}"]`)

            if (
                squareArray.length > 1 &&
                squareArray[0].innerText == squareArray[1].innerText
            ) {
                var square = squareArray[0],
                    newNum = square.innerText * 2

                if (key == 'analyze')
                    currentSquaresArray.push(newNum)

                if (key == 'move') {
                    var plusText = document.querySelector('.plus-text')
                    if (plusText)
                        plusText.remove()

                    if (playerIndex == 0) {
                        var len = filledSquares.length
                        for (var index = 0; index < len; index++) {
                            if (filledSquares[index] == coords)
                                filledSquares.splice(index, 1)
                        }
                    }

                    else if (playerIndex == 1) {
                        var len = aiFilledSquares.length
                        for (var index = 0; index < len; index++) {
                            if (aiFilledSquares[index] == coords)
                                aiFilledSquares.splice(index, 1)
                        }
                    }
                    
                    var scoreBlock = document.querySelectorAll('.score-block')[playerIndex],
                        scoreTitle = scoreBlock.querySelector('.score-title'),
                        newSquare = document.createElement('div'),
                        plusText = document.createElement('div'),
                        squareTop = square.style.top,
                        squareLeft = square.style.left,
                        scoreValues = document.querySelectorAll('.score-value')
                    
                    if (playerIndex == 0) {
                        score += newNum
                        scoreValues[0].innerText = score

                        if (score > bestScore) {
                            bestScore = score
                            localStorage.setItem('best-score', bestScore)
                            
                            if (lastModeIndex == 0)
                                scoreValues[1].innerText = bestScore
                        }
                    }

                    else if (playerIndex == 1) {
                        aiScore += newNum
                        scoreValues[1].innerText = aiScore
                    }
                    
                    squareArray.forEach(miniSquare => {
                        miniSquare.remove()
                    })

                    newSquare.className = 'square'
                    newSquare.innerText = newNum
                    newSquare.setAttribute('coords', coords)

                    newSquare.style = `
                        transition: top .127s, left .127s, background-color 1s, border-radius 1s, color 1s;
                        background-color: ${cellBgColors[newNum]};
                        top: ${squareTop};
                        left: ${squareLeft};`
                    
                    if (document.body.className == '') {
                        var log = Math.log(newNum) / Math.log(2)
                        log < 3 ? newSquare.style.color = '#776e65' : newSquare.style.color = '#f9f6f2'
                    }

                    else if (document.body.className == 'dark')
                        newSquare.style.color = '#f9f6f2'
                    
                    else if (document.body.className == 'colorful') {
                        var log = Math.log(newNum) / Math.log(2)
                        log < 3 ? newSquare.style.color = '#515151' : newSquare.style.color = '#f9f6f1'
                    }

                    if (newNum >= 128 && document.body.className != 'colorful') {
                        var log = Math.log(newNum) / Math.log(2),
                            shadowAlpha = ((log - 7) * 5 + 14) / 100,
                            insetAlpha = ((log - 7) * 8 + 24) / 100
                        
                        if (document.body.className == 'dark')
                            insetAlpha = 0 

                        newSquare.style.boxShadow = `
                            0 0 30px 10px rgba(243, 215, 116, ${shadowAlpha}),
                            inset 0 0 0 1px rgba(255, 255, 255, ${insetAlpha})`
                    }

                    if (String(newNum).length == 3)
                        newSquare.style.fontSize = '60px'
                    if (String(newNum).length == 4)
                        newSquare.style.fontSize = '50px'
                    squares.appendChild(newSquare)

                    plusText.className = 'plus-text'
                    plusText.innerText = '+ ' + newNum
                    scoreBlock.insertBefore(plusText, scoreTitle)

                    if (newNum == 2048) {
                        if (lastModeIndex == 1) {
                            const aiSection = document.querySelector('.ai-section')
                            aiSection.classList.add('blured')
                        }

                        const undoBlock = document.querySelector('.undo-block'),
                              gameOverAlert = document.querySelector('.game-over-alert'),
                              gameOverBg = gameOverAlert.querySelector('.game-over-bg'),
                              gameOverTitle = gameOverAlert.querySelector('.game-over-title')
                        
                        undoBlock.style.opacity = '0'
                        isUndo = false
                        
                        if (playerIndex == 0) {
                            gameOverBg.style.backgroundColor = '#e1c864'
                            gameOverTitle.innerText = 'You win!'
                            gameOverAlert.classList.add('active')

                            if (canBePlayed)
                                victorySound.play()
                        }

                        else if (playerIndex == 1) {
                            gameOverBg.style.backgroundColor = '#000'
                            gameOverTitle.innerText = 'Game over!'
                            gameOverAlert.classList.add('active')

                            if (canBePlayed) {
                                const defeatSound = new Audio()
                                defeatSound.volume = .2
                                defeatSound.src = `music/defeat/defeat${Math.round(Math.random() * 6) + 1}.mp3`
                                defeatSound.play()
                                canBePlayed = false
                            }
                        }
                    }
                }
            }

            else if (key == 'analyze') {
                if (squareArray[0]) {
                    currentSquaresArray.push(
                        parseInt(squareArray[0].innerText)
                    )
                }
            }
        }
    }

    if (key == 'analyze')
        return currentSquaresArray
}

function startingSwipe(event) {
    var isUndoBlock = false,
        el = event.target
    
    for (var i = 0; i < 3; i++) {
        if (el.className == 'undo-block')
            isUndoBlock = true
        el = el.parentNode
    }

    if (!isUndoBlock && canBeMoved) {
        currentPlayerSquaresArray = createCurrentPlayerSquaresArray()
        startedSwipe = [
            event.touches[0].clientX,
            event.touches[0].clientY
        ]
    }
}

function endingSwipe(event) {
    if (startedSwipe) {
        var changedSwipe = [
            startedSwipe[0] - event.changedTouches[0].clientX,
            startedSwipe[1] - event.changedTouches[0].clientY
        ]
    
        if (
            changedSwipe[0] > 0 &&
            changedSwipe[0] > Math.abs(changedSwipe[1])
        ) {
            moveSquares('left')
            checkAiPos()
        }
    
        else if (
            changedSwipe[1] > 0 &&
            changedSwipe[1] > Math.abs(changedSwipe[0])
        ) {
            moveSquares('up')
            checkAiPos()
        }
    
        else if (
            changedSwipe[0] < 0 &&
            Math.abs(changedSwipe[0]) > Math.abs(changedSwipe[1])
        ) {
            moveSquares('right')
            checkAiPos()
        }
    
        else if (
            changedSwipe[1] < 0 &&
            Math.abs(changedSwipe[1]) > Math.abs(changedSwipe[0])
        ) {
            moveSquares('down')
            checkAiPos()
        }

        startedSwipe = []
    }
}

function showSettings() {
    const settingsMenu = document.querySelector('.settings-menu'),
          settingsMenuContent = settingsMenu.querySelector('.settings-menu-content'),
          settingsMenuButton = document.querySelector('.settings-menu-button'),
          innerSettingsMenuButton = settingsMenuButton.querySelector('div'),
          main = document.querySelector('main'),
          leftSide = document.querySelector('.left-side'),
          rightSide = document.querySelector('.right-side')

    settingsMenu.classList.toggle('active')
    settingsMenuButton.classList.toggle('active')
    main.classList.toggle('blured')
    leftSide.classList.toggle('blured')
    rightSide.classList.toggle('blured')

    if (settingsMenu.classList.contains('active')) {
        canBeMoved = false

        if (settingsMenuContent.scrollHeight > window.offsetHeight) {
            settingsMenuButton.style.width = '240px'
            innerSettingsMenuButton.style.width = '240px'
        }

        else {
            settingsMenuButton.style.width = '250px'
            innerSettingsMenuButton.style.width = '250px'
        }
    }
    
    else {
        canBeMoved = true
        settingsMenuButton.style.width = '80px'
        innerSettingsMenuButton.style.width = '80px'
    }
}

function changeTheme(themeIndex) {
    if (themeIndex != lastThemeIndex) {
        const categoryOption = document.querySelector('.category-block').querySelectorAll('.category-option span')[themeIndex]
        categoryOption.style.color = '#fff'

        const lastCategoryOption = document.querySelector('.category-block').querySelectorAll('.category-option span')[lastThemeIndex]
        lastCategoryOption.style.color = '#ddd'

        const selectedOption = document.querySelector('.selected-option')
        selectedOption.style.top = (themeIndex + 1) * 80 + 'px'

        localStorage.setItem('theme-index', themeIndex)
        lastThemeIndex = themeIndex

        const leftSide = document.querySelector('.left-side'),
              rightSide = document.querySelector('.right-side')

        if (themeIndex == 0 || themeIndex == 1) {
            clearInterval(rotateGradient)
            document.body.style.removeProperty('background-image')
        }

        if (themeIndex == 0) {
            document.body.className = ''
            leftSide.classList.remove('hid')
            rightSide.classList.remove('hid')
        }
        
        else if (themeIndex == 1) {
            document.body.className = 'dark'
            leftSide.classList.add('hid')
            rightSide.classList.add('hid')
        }

        else if (themeIndex == 2) {
            angle = 45
            document.body.style.backgroundImage = `linear-gradient(${angle}deg, #145567, #5eb252)`
            document.body.style.backgroundSize = `100vw ${document.body.scrollHeight}px`

            document.body.className = 'colorful'
            leftSide.classList.add('hid')
            rightSide.classList.add('hid')

            rotateGradient = setInterval(() => {
                angle++
                angle %= 360
                document.body.style.backgroundImage = `linear-gradient(${angle}deg, #145567, #5eb252)`
            }, 1000)
        }

        setSquareColors()
        const squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            var num = square.innerText
            square.style.backgroundColor = cellBgColors[num]
            
            if (themeIndex == 0) {
                var log = Math.log(num) / Math.log(2)
                log < 3 ? square.style.color = '#776e65' : square.style.color = '#f9f6f2'
            }

            else if (themeIndex == 1) {
                square.style.color = '#f9f6f2'
            }

            else if (themeIndex == 2) {
                var log = Math.log(num) / Math.log(2)
                log < 3 ? square.style.color = '#515151' : square.style.color = '#f9f6f1'
            }
        })
    }
}

function changeMode(modeIndex) {
    if (modeIndex != lastModeIndex) {
        const categoryOption = document.querySelector('.category-block:last-child').querySelectorAll('.category-option span')[modeIndex]
        categoryOption.style.color = '#fff'

        const lastCategoryOption = document.querySelector('.category-block:last-child').querySelectorAll('.category-option span')[modeIndex]
        lastCategoryOption.style.color = '#ddd'

        const selectedOption = document.querySelectorAll('.selected-option')[1]
        selectedOption.style.top = (modeIndex + 1) * 80 + 'px'

        const aiSection = document.querySelector('.ai-section')
        aiSection.classList.toggle('active')

        const scoreTitle = document.querySelectorAll('.score-title')[1],
              undoBlock = document.querySelector('.undo-block')

        if (modeIndex == 0) {
            if (canBeOverflowed)
                document.body.style.overflowY = 'hidden'
            
            scoreTitle.innerText = 'Best'
            undoBlock.style.opacity = '1'
            isUndo = true
        }

        else if (modeIndex == 1) {
            if (canBeOverflowed)
                document.body.style.removeProperty('overflow-y')
            
            scoreTitle.innerText = 'AI Score'
            undoBlock.style.opacity = '0'
            isUndo = false
        }

        window.scrollTo(0, document.body.offsetHeight)
        lastModeIndex = modeIndex

        setScale(2)
        startGame()
    }
}

function createCurrentPlayerSquaresArray() {
    const rows = document.querySelectorAll('.row')
    currentPlayerSquaresArray = []

    for (var row = 0; row < 4; row++) {
        const cells = rows[row].querySelectorAll('.cell')
        var currentRowArray = []

        for (var cell = 0; cell < 4; cell++) {
            var coords = cells[cell].getAttribute('coords'),
                square = document.querySelector(`[coords='${coords}']`)
            
            if (square.innerText)
                currentRowArray.push(parseInt(square.innerText))
            else
                currentRowArray.push(0)
        }

        currentPlayerSquaresArray.push(currentRowArray)
    }

    return currentPlayerSquaresArray
}

function undo() {
    if (isUndo) {
        const squares = document.querySelector('.squares'),
              allSquares = squares.querySelectorAll('.square')

        filledSquares = []
        allSquares.forEach(square => square.remove())
        var len = currentPlayerSquaresArray.length

        for (var index = 0; index < len ** 2; index++) {
            var square = document.createElement('div'),
                coordsX = index % len,
                coordsY = Math.floor(index / len),
                num = currentPlayerSquaresArray[coordsY][coordsX]

            if (num) {
                filledSquares.push(`[${coordsX},${coordsY}]`)
                square.className = 'square'
                square.setAttribute('coords', `[${coordsX},${coordsY}]`)
                square.innerHTML = num

                square.style = `
                    transition: top .127s, left .127s, background-color 1s, border-radius 1s, color 1s;
                    background-color: ${cellBgColors[num]};
                    top: ${coordsY * 152 + 9}px;
                    left: ${coordsX * 152 + 9}px;`
                
                if (document.body.className == '') {
                    var log = Math.log(num) / Math.log(2)
                    log < 3 ? square.style.color = '#776e65' : square.style.color = '#f9f6f2'
                }

                else if (document.body.className == 'dark')
                    square.style.color = '#f9f6f2'
                
                else if (document.body.className == 'colorful') {
                    var log = Math.log(num) / Math.log(2)
                    log < 3 ? square.style.color = '#515151' : square.style.color = '#f9f6f1'
                }

                if (num >= 128 && document.body.className != 'colorful') {
                    var log = Math.log(num) / Math.log(2),
                        shadowAlpha = ((log - 7) * 5 + 14) / 100,
                        insetAlpha = ((log - 7) * 8 + 24) / 100
                    
                    if (document.body.className == 'dark')
                        insetAlpha = 0 

                    square.style.boxShadow = `
                        0 0 30px 10px rgba(243, 215, 116, ${shadowAlpha}),
                        inset 0 0 0 1px rgba(255, 255, 255, ${insetAlpha})`
                }

                if (String(num).length == 3)
                    square.style.fontSize = '60px'
                if (String(num).length == 4)
                    square.style.fontSize = '50px'
                squares.appendChild(square)
            }
        }

        const undoBlock = document.querySelector('.undo-block'),
              undo = undoBlock.querySelector('svg')
        undoBlock.style.opacity = '0'
        undo.style.transform = 'rotate(-360deg)'
        isUndo = false
    }
}

function rippleShow(el) {
    var rippleEl = document.querySelector('span.ripple'),
        _firstChild_ = el.firstChild

    if (!rippleEl) {var rippleEl = document.createElement('span')}
    else {rippleEl.classList.remove('hide')}

    el.insertBefore(rippleEl, _firstChild_)
    var max = Math.max(el.offsetWidth, el.offsetHeight)
    rippleEl.style.width = rippleEl.style.height = max + 'px';

    var rect = el.getBoundingClientRect()
    rippleEl.style.left = event.clientX - rect.left - (max / 2) + 'px'
    rippleEl.style.top = event.clientY - rect.top - (max / 2) + 'px'

    rippleEl.classList.add('ripple')
}

function rippleHide() {
    const ripples = document.querySelectorAll('.ripple')

    ripples.forEach(ripple => {
        ripple.classList.add('hide')
        setTimeout(() => ripple.remove(), 500)
    })
}

document.addEventListener('keydown', e => {
    if (canBeMoved) {
        if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
            currentPlayerSquaresArray = createCurrentPlayerSquaresArray()
            moveSquares('left')

            if (lastModeIndex == 1)
                checkAiPos()
        }
        
        else if (e.code == 'ArrowUp' || e.code == 'KeyW') {
            currentPlayerSquaresArray = createCurrentPlayerSquaresArray()
            moveSquares('up')

            if (lastModeIndex == 1)
                checkAiPos()
        }
        
        else if (e.code == 'ArrowRight' || e.code == 'KeyD') {
            currentPlayerSquaresArray = createCurrentPlayerSquaresArray()
            moveSquares('right')

            if (lastModeIndex == 1)
                checkAiPos()
        }

        else if (e.code == 'ArrowDown' || e.code == 'KeyS') {
            currentPlayerSquaresArray = createCurrentPlayerSquaresArray()
            moveSquares('down')

            if (lastModeIndex == 1)
                checkAiPos()
        }
    }

    const settingsMenu = document.querySelector('.settings-menu')
    if (settingsMenu.classList.contains('active') &&
        e.code == 'Escape')
        showSettings()
})

window.addEventListener('resize', () => {
    if (lastModeIndex == 0)
        setScale()
    
    else if (lastModeIndex == 1)
        setScale(3)
})
