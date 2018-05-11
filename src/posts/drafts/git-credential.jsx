import { Article, CodeBlock, Link } from "../../components/Article";

export const meta = {
    title: "Git - Credential helper",
    tags: ["git", "ubuntu"],
    note: true,
    date: "2018-05-06T11:20:53.320Z",
}

export default () => {
    return <Article {...meta}>
        <h2>Setup on Ubuntu</h2>

        <h3>Compile the keyring</h3>
        <CodeBlock lang="bash" children={`
sudo apt-get install libgnome-keyring-dev
sudo make --directory=/usr/share/doc/git/contrib/credential/gnome-keyring
        `} />

        <h3>Setup config</h3> 
        <CodeBlock lang="bash" children={`
git config --global credential.helper /usr/share/doc/git/contrib/credential/gnome-keyring/git-credential-gnome-keyring
        `} />

    </Article>
}