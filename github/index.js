const fetch = require('node-fetch')

const credentials = new Map()

class GitHub {
    constructor() {

        this.baseURL = params => 'https://api.github.com/' + params

        this.user = {
            token: credentials.get("token"),
            username: credentials.get("username"),
            password: credentials.get("password"),
        }

        this.defaultHeader = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.user.token
            }
        }
    }

    async getUser(username) {
        const response = await fetch(username ? this.baseURL(`users/${username}`) : this.baseURL('user'), {
            method: 'GET',
            ...this.defaultHeader
        })
        return response.json()
    }

    filter(data, filterFunction) {
        return data.filter(filterFunction)
    }

    limit(data, limit) {
        return data.slice(0, limit)
    }

    async getRepos(username, options = {}) {
        const response = await fetch(username ? this.baseURL(`users/${username}/repos`) : this.baseURL('repos'), {
            method: 'GET',
            ...this.defaultHeader
        })

        const data = await response.json()

        if (options.filter && options.limit) return this.limit(this.filter(data, options.filter), options.limit)

        if (options.filter && !options.limit) return this.filter(data, options.filter)

        if (!options.filter && options.limit) return this.limit(data, options.limit)

        return data

    }

    async getGists(username, options = {}) {
        const response = await fetch(this.baseURL(`users/${username}/gists`), {
            method: 'GET',
            ...this.defaultHeader
        })

        const data = await response.json()

        if (options.limit) return data.slice(0, options.limit)

        return data
    }

    async getFileContent(file) {
        const response = await fetch(file.raw_url, {
            method: 'GET',
            ...this.defaultHeader
        })

        const data = await response.text()
        return data
    }

    async createRepo(data) {
        const response = await fetch(this.baseURL(`user/repos`), {
            method: 'POST',
            body: JSON.stringify({
                name: data.name,
                description: data.description
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(this.user.username + ':' + this.user.password).toString('base64')
            }
        })

        return await response.json()
    }

    async createFileOnRepository({ repository, filepath, content, commitMessage }) {
        const response = await fetch(this.baseURL(`repos/${this.user.username}/${repository}/contents/${filepath}`), {
            method: 'PUT',
            body: JSON.stringify({
                content,
                message: commitMessage
            }),
            ...this.defaultHeader
        })

        return await response.json()
    }

    async getFileOnRepository({ repository, filepath }) {
        const response = await fetch(this.baseURL(`repos/${this.user.username}/${repository}/contents/${filepath}`), {
            method: 'GET',
            ...this.defaultHeader
        })

        const data = await response.json()

        if (data.content) {
            const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8')
            return { ...data, decodedContent }
        }

        return { ...data }
    }

    async getDirOnRepository({ owner, repository, dirpath }) {
        const DIR_ON_REPOSITORY_URL = this.baseURL(`repos/${owner}/${repository}/contents/${dirpath}`)

        const response = await fetch(DIR_ON_REPOSITORY_URL, {
            method: 'GET',
            ...this.defaultHeader
        })

        const data = await response.json()

        return data
    }

    async run(path, options) {
        const response = await fetch(this.baseURL(path), {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(this.user.username + ':' + this.user.password).toString('base64')
            }
        })

        return await response.json()
    }

    static setCredentials({ username = ``, password = ``, token = `` }) {
        credentials.set('username', username)
        credentials.set('password', password)
        credentials.set('token', token)
    }
}

module.exports = GitHub