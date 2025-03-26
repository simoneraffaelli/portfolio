export function handleEasterEgg() {
    const cl = document.body.classList;
    if (cl.contains('lol')) {
        cl.remove('lol');
    } else {
        cl.add('lol');
    }
}

export const easterEggSequence = ['s', 'i', 'm', 'o', 'n', 'e'];