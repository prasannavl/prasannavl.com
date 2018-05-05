import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "A pleasant birthday gift",
    date: "2010-12-10T00:00:00.000Z",
    tags: ["general"],
    description: "Thanks to my friends who bought me the domain as birthday gift"
}

export default () => {
    return <Article {...meta}>
        <p>Well, thanks to two of my friends - <strong>Prassanna Ganesh</strong> and <strong>Abhinit Kumar</strong>, I now have a website under my name.</p>

        <p>I'm a tad bit busy to do anything with it at the moment. But I'm sure to come up with something for this site, sooner or later. Until then, its just an empty cup waiting to be filled.</p>

        <p>And cheers to all my MIT 2007 batch-mates! 4 Unforgettable years of our lives! For all that we know, could be the best in many ways. Nevertheless, here's to a more exciting future and an incredible journey ahead - cheers!</p>

        <p><em>Thanks again</em> to Abhinit and RPG.</p>
    </Article>
}