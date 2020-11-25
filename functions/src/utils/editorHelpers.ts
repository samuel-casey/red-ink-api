import {Editor} from '../db/models/editor'

export const mapEditorData = (editor: any, array: Editor[]) => {
    const editorData = {
                doc_id: editor.id, 
                uid: editor.data().uid, 
                first_name: editor.data().first_name,
                last_name: editor.data().last_name,
                about_me: editor.data().about_me,
                area_of_expertise: editor.data().area_of_expertise,
                email: editor.data().email,
                profile_img_url: editor.data().profile_img_url,
                linkedin_url: editor.data().linkedin_url,
                twitter_url: editor.data().twitter_url,
    } 
    array.push(editorData)
}