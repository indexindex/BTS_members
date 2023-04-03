module.exports = (template, member) => {
    const { id, slug, image, memberName, 
            fullName, role, born, height, 
            nationality, about } = member;

    let output;
    
    // ? replace all global instances of encountered match
    output = template.replace(/{_ID_}/g, id);
    output = output.replace(/{_SLUG_}/g, slug);
    output = output.replace(/{_IMAGE_}/g, image);
    output = output.replace(/{_MEMBER_NAME_}/g, memberName);
    output = output.replace(/{_FULL_NAME_}/g, fullName);
    output = output.replace(/{_ROLE_}/g, role);
    output = output.replace(/{_BORN_}/g, born);
    output = output.replace(/{_HEIGHT_}/g, height);
    output = output.replace(/{_NATIONALITY_}/g, nationality);
    output = output.replace(/{_ABOUT_}/g, about);

    return output;
}