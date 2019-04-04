import "../../css/footer/footer.css";
import createFooter from './createFooter.js'

class Footer{
    constructor(){
        this.content = createFooter()
        this.footer = document.createElement('footer')
        this.render()
    }

    render() {
        this.footer.appendChild(this.content)
    }
}

export {Footer};