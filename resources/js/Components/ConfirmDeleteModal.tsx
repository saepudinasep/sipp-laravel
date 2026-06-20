interface Props {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export default function ConfirmDeleteModal({ open, onClose, onDelete }: Props) {
    if (!open) return null;

    return (
        <div className="modal-overlay open">
            <div className="modal" style={{ maxWidth: 400 }}>
                <div className="modal-head">
                    <h3>Hapus Data?</h3>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{ fontSize: 13, color: "var(--text2)" }}>
                        Data akan dipindahkan ke soft delete dan dapat
                        dipulihkan kembali bila diperlukan.
                    </p>
                </div>

                <div className="modal-foot">
                    <button className="btn btn-outline" onClick={onClose}>
                        Batal
                    </button>

                    <button className="btn btn-danger" onClick={onDelete}>
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
