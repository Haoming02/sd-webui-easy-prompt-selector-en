class LeSelector {

    static baseButton(text, { size = 'sm', color = 'primary' }) {
        const button = gradioApp().getElementById('txt2img_generate').cloneNode()

        button.removeAttribute('id')
        button.classList.remove('gr-button-lg', 'gr-button-primary', 'lg', 'primary')
        button.classList.add(`gr-button-${size}`, `gr-button-${color}`, size, color)
        button.textContent = text

        return button
    }

    static openButton({ onClick }) {
        const button = gradioApp().getElementById('paste').cloneNode()

        button.removeAttribute('id')
        button.removeAttribute('title')
        button.textContent = '🔯'
        button.addEventListener('click', onClick)

        return button
    }

    static tagFields() {
        const fields = document.createElement('div')

        fields.style.display = 'flex'
        fields.style.flexDirection = 'row'
        fields.style.flexWrap = 'wrap'
        fields.style.minWidth = 'min(320px, 100%)'
        fields.style.maxWidth = '100%'
        fields.style.flex = '1 calc(50% - 20px)'
        fields.style.borderWidth = '1px'
        fields.style.borderColor = 'var(--block-border-color,#374151)'
        fields.style.borderRadius = 'var(--block-radius,8px)'
        fields.style.padding = '8px'
        fields.style.height = 'fit-content'

        return fields
    }

    static areaContainer(id = '') {
        const container = gradioApp().getElementById('txt2img_results').cloneNode()

        container.id = id
        container.style.gap = 0
        container.style.display = 'none'

        return container
    }

    static tagButton({ title, onClick, onRightClick, color = 'primary' }) {
        const button = LeSelector.baseButton(title, { color })

        button.style.height = '2rem'
        button.style.flexGrow = '0'
        button.style.margin = '2px'

        button.addEventListener('click', onClick)
        button.addEventListener('contextmenu', onRightClick)

        return button
    }

    static dropDown(id, options, { onChange }) {
        const select = document.createElement('select')
        select.id = id

        // gradio 3.16
        select.classList.add('gr-box', 'gr-input')

        // gradio 3.22
        select.style.color = 'var(--body-text-color)'
        select.style.backgroundColor = 'var(--input-background-fill)'
        select.style.borderColor = 'var(--block-border-color)'
        select.style.borderRadius = 'var(--block-radius)'
        select.style.margin = '2px'
        select.addEventListener('change', (event) => { onChange(event.target.value) })

        const none = ['null']
        none.concat(options).forEach((key) => {
            const option = document.createElement('option')
            option.value = key
            option.textContent = key
            select.appendChild(option)
        })

        return select
    }

    static checkbox(text, { onChange }) {
        const label = document.createElement('label')
        const checkbox = gradioApp().querySelector('input[type=checkbox]').cloneNode()
        const span = document.createElement('span')

        label.style.display = 'flex'
        label.style.alignItems = 'center'

        checkbox.checked = false
        checkbox.addEventListener('change', (event) => {
            onChange(event.target.checked)
        })

        span.style.marginLeft = 'var(--size-2, 8px)'
        span.textContent = text

        label.appendChild(checkbox)
        label.appendChild(span)

        return label
    }
}

class InteractiveTagSelector {
    PATH_FILE = 'tmp/interactiveTagSelector.txt'
    AREA_ID = 'interactive-tag-selector'
    SELECT_ID = 'interactive-tag-selector-select'
    CONTENT_ID = 'interactive-tag-selector-content'
    TO_NEGATIVE_PROMPT_ID = 'interactive-tag-selector-to-negative-prompt'

    constructor(yaml, gradioApp) {
        this.yaml = yaml
        this.gradioApp = gradioApp
        this.visible = false
        this.toNegative = false
        this.tags = undefined
    }

    async init() {
        this.tags = await this.parseFiles()
    }

    async readFile(filepath) {
        const response = await fetch(`file=${filepath}?${new Date().getTime()}`);

        return await response.text();
    }

    async parseFiles() {
        const text = await this.readFile(this.PATH_FILE);
        if (text === '') { return {} }

        const paths = text.split(/\r\n|\n/)

        const tags = {}
        for (const path of paths) {
            const filename = path.split('/').pop().split('.').shift()
            const data = await this.readFile(path)
            yaml.loadAll(data, function (doc) {
                tags[filename] = doc
            })
        }

        return tags
    }

    // Render
    render() {
        const row = document.createElement('div')
        row.style.display = 'flex'
        row.style.alignItems = 'center'
        row.style.gap = '10px'

        const dropDown = this.renderDropdown()
        dropDown.style.flex = '1'
        dropDown.style.minWidth = '1'
        row.appendChild(dropDown)

        const settings = document.createElement('div')
        const checkbox = LeSelector.checkbox('Add to Negative', {
            onChange: (checked) => { this.toNegative = checked }
        })

        settings.style.flex = '1'
        settings.appendChild(checkbox)

        row.appendChild(settings)

        const container = LeSelector.areaContainer(this.AREA_ID)

        container.appendChild(row)
        container.appendChild(this.renderContent())

        return container
    }

    renderDropdown() {
        const dropDown = LeSelector.dropDown(
            this.SELECT_ID,
            Object.keys(this.tags), {
            onChange: (selected) => {
                const content = gradioApp().getElementById(this.CONTENT_ID)
                Array.from(content.childNodes).forEach((node) => {
                    const visible = node.id === `interactive-tag-selector-container-${selected}`
                    this.changeVisibility(node, visible)
                })
            }
        }
        )

        return dropDown
    }

    renderContent() {
        const content = document.createElement('div')
        content.id = this.CONTENT_ID

        Object.keys(this.tags).forEach((key) => {
            const values = this.tags[key]

            const fields = LeSelector.tagFields()
            fields.id = `interactive-tag-selector-container-${key}`
            fields.style.display = 'none'
            fields.style.flexDirection = 'row'
            fields.style.marginTop = '10px'

            this.renderTagButtons(values, key).forEach((group) => {
                fields.appendChild(group)
            })

            content.appendChild(fields)
        })

        return content
    }

    renderTagButtons(tags, prefix = '') {
        if (Array.isArray(tags)) {
            return tags.map((tag) => this.renderTagButton(tag, tag, 'secondary'))
        } else {
            return Object.keys(tags).map((key) => {
                const values = tags[key]
                const randomKey = `${prefix}:${key}`

                if (typeof values === 'string') { return this.renderTagButton(key, values, 'secondary') }

                const fields = LeSelector.tagFields()
                fields.style.flexDirection = 'column'

                fields.append(this.renderTagButton(key, `@${randomKey}@`))

                const buttons = LeSelector.tagFields()
                buttons.id = 'buttons'
                fields.append(buttons)
                this.renderTagButtons(values, randomKey).forEach((button) => {
                    buttons.appendChild(button)
                })

                return fields
            })
        }
    }

    renderTagButton(title, value, color = 'primary') {
        return LeSelector.tagButton({
            title,
            onClick: (e) => {
                e.preventDefault();

                this.addTag(value, this.toNegative || e.metaKey || e.ctrlKey)
            },
            onRightClick: (e) => {
                e.preventDefault();

                this.removeTag(value, this.toNegative || e.metaKey || e.ctrlKey)
            },
            color
        })
    }

    // Util
    changeVisibility(node, visible) {
        node.style.display = visible ? 'flex' : 'none'
    }

    addTag(tag, toNegative = false) {
        const id = toNegative ? 'txt2img_neg_prompt' : 'txt2img_prompt'
        const textarea = gradioApp().getElementById(id).querySelector('textarea')

        if (textarea.value.trim() === '') {
            textarea.value = tag
        } else if (textarea.value.trim().endsWith(',')) {
            textarea.value += ' ' + tag
        } else {
            textarea.value += ', ' + tag
        }

        updateInput(textarea)
    }

    removeTag(tag, toNegative = false) {
        const id = toNegative ? 'txt2img_neg_prompt' : 'txt2img_prompt'
        const textarea = gradioApp().getElementById(id).querySelector('textarea')

        if (textarea.value.trimStart().startsWith(tag)) {
            const matched = textarea.value.match(new RegExp(`${tag.replace(/[-\/\\^$*+?.()|\[\]{}]/g, '\\$&')},*`))
            textarea.value = textarea.value.replace(matched[0], '').trimStart()
        } else {
            textarea.value = textarea.value.replace(`, ${tag}`, '')
        }

        updateInput(textarea)
    }
}

onUiLoaded(async () => {
    yaml = window.jsyaml
    const interactiveTagSelector = new InteractiveTagSelector(yaml, gradioApp())
    const extraNetwork = document.getElementById('txt2img_extra_networks')
    await interactiveTagSelector.init()

    const button = LeSelector.openButton({
        onClick: () => {
            if (extraNetwork.classList.contains('secondary-down'))
                extraNetwork.dispatchEvent(new Event('click'))
            const tagArea = gradioApp().querySelector(`#${interactiveTagSelector.AREA_ID}`)
            interactiveTagSelector.changeVisibility(tagArea, interactiveTagSelector.visible = !interactiveTagSelector.visible)
        }
    })

    extraNetwork.addEventListener('click',
        () => {
            const selector = document.getElementById('interactive-tag-selector')
            if (selector.style.display != 'none')
                button.dispatchEvent(new Event('click'))
        }
    )

    const txt2imgActionColumn = gradioApp().getElementById('txt2img_tools').querySelector('.form')
    txt2imgActionColumn.appendChild(button)

    gradioApp().getElementById('txt2img_toprow').after(interactiveTagSelector.render())
})