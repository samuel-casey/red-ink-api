interface Editor {
    email: string,
    uid: string
}
interface Submission {
    sub_id: string;
    editor_id: string; 
    writer_id: string;
    url: string;
    title: string;
    edits_complete: boolean;
}