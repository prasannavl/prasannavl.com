export function setupTitleForContext(titleSetConfig, context) {
    const titleTemplate = titleSetConfig.titleTemplate;
    const title = titleSetConfig.title;
    const titleOnEmpty = titleSetConfig.titleOnEmpty;

    if (titleTemplate !== null && titleTemplate !== undefined) context.title.setTemplate(titleTemplate);
    if (titleOnEmpty !== null && titleOnEmpty !== undefined) context.title.setOnEmpty(titleOnEmpty);
    if (title !== null && title !== undefined) context.title.set(title);
}