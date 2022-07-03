export const isEmpty = value => {
    if(!value ) return true
    return false
}

export const isEmail = Email => {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(Email);
}

export const isLength = MatKhau => {
    if(MatKhau.length < 6) return true
    return false
}

export const isMatch = (MatKhau, cf_MatKhau) => {
    if(MatKhau === cf_MatKhau) return true
    return false
}

