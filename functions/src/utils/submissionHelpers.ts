import { Submission } from '../db/models/submission'

export const mapSubmissionData = (sub: any, array: Submission[]) => {
    array.push({
        submission_id: sub.id,
        created_at: sub.data().created_at,
        editor_id: sub.data().editor_id, 
        writer_id: sub.data().writer_id,
        url: sub.data().url,
        notes: sub.data().notes,
        title: sub.data().title,
        edits_status: sub.data().edits_status,
        editor_reminded: sub.data().editor_reminded,
        writer_notified: sub.data().writer_notified
    })
}
