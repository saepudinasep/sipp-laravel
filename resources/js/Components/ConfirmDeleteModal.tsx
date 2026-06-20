interface Props {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export default function ConfirmDeleteModal({ open, onClose, onDelete }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[400px]">
                <h2 className="font-bold mb-3">Hapus Data?</h2>

                <p>Data akan dipindahkan ke soft delete.</p>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Batal
                    </button>

                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
