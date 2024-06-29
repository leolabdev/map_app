export const ProfileCreateReq = {
    username: true,
    password: true
}
export const ProfileCreateRes = {
    username: true,
    id: true
}

export const ProfileReadRes = {
    username: true,
    id: true
}

export const ProfileUpdateReq = {
    username: true,
    password: true
}

export const ProfileSignInReq = {
    username: true,
    password: true
}
export const ProfileSignInRes = {
    id: true,
    username: true,
    accessToken: true,
    expiresOn: true
}