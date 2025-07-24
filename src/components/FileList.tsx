import React, { useEffect, useState } from 'react';
import { downloadFile, getFileList } from '../ApiService';


interface ExcelFile {
    name: string;
}

const FileList: React.FC = () => {
    const [files, setFiles] = useState<ExcelFile[]>([]);

    const GetFiles = async () => {
        try {
            const response = await getFileList();
            const filesArray = response?.data?.files ?? [];
            setFiles(filesArray);
        } catch (error) {
            console.error("Error fetching files:", error);
            setFiles([]);
        }
    }


    useEffect(() => {
        GetFiles()
    }, []);

    const download = async (name: any) => {
        try {
            const response = await downloadFile(name);
            if (response.data) {

                const { downloadUrl, filename } = response.data;
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = filename || "apollo_contacts.xlsx";
                link.click();
            }
        } catch (error: any) {
            alert("Download failed: " + error.message);
        }
    }

    return (
        <div className="container mt-4">
            <h2>Download Excel Reports</h2>
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">File Name</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => (
                        <tr key={file.name}>
                            <td>{index + 1}</td>
                            <td>{file.name}</td>
                            <td>
                                <button
                                    onClick={() => download(file.name)}
                                    className="btn btn-sm btn-primary"
                                >
                                    Download
                                </button>
                            </td>
                        </tr>
                    ))}
                    {files.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-center text-muted">
                                No files available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export { FileList };