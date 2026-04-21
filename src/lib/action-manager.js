let _steps = []

export default function () {

    addStep: (items) => {
        _steps = [..._steps, ...items]
    }

}
