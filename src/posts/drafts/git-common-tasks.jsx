import { Article, CodeBlock } from "../../components/Article"; 

export const meta = {
    title: "Git - Common tasks",
    tags: ["git"],
    note: true,
    date: "2018-05-06T12:48:32.891Z",
}

export default () => {
    return <Article {...meta}>
        <h2>Reset master to a better branch</h2>

        <CodeBlock lang="bash" children={`
git checkout master
git reset --hard better_branch
git push -f origin master       
        `}/>

        <h2>Merge better branch into master</h2>
        
        <CodeBlock lang="bash" children={`
git checkout better_branch
git merge --strategy=ours master    # keep the content of this branch, but record a merge
git checkout master
git merge better_branch             # fast-forward master up to the merge      
        `}/>

        <h3>With explicit history</h3>

        <CodeBlock lang="bash" children={`
git checkout better_branch
git merge --strategy=ours --no-commit master
git commit          # add better history info
git checkout master
git merge better_branch
        `} />

    </Article>
}