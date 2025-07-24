import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { manualSearch, processDetail, startAutomation, statusAutomation, stopAutomation } from "../ApiService.ts";
import { FileList } from './FileList.tsx'

interface SearchForm {
    person_locations: string;
    person_seniorities: string;
    organization_locations: string;
    page: number;
    per_page: number;
}

const ApolloSearch: React.FC = () => {
    const [isProcessUp, setIsProcessUp] = useState(false)
    const [processDetails, setProcessDetails] = useState<any>({})
    const [form, setForm] = useState<SearchForm>({
        person_locations: "",
        person_seniorities: "",
        organization_locations: "",
        page: 1,
        per_page: 20,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "page" || name === "per_page" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await manualSearch(form);
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
    };

    const checkprocess = async () => {
        try {
            const response = await statusAutomation();
            if (response.data) {

                setIsProcessUp(response.data.isProcessUp)

            }
        } catch (error: any) {
            alert("API Failed" + error.message);
        }
    }


    const startprocess = async () => {
        try {
            const response = await startAutomation();
            if (response.data) {
                setIsProcessUp(true)
                alert("Apollo API Automation Started...")
            }
        } catch (error: any) {
            alert("API Failed" + error.message);
        }
    }


    const stopprocess = async () => {
        try {
            const response = await stopAutomation();
            if (response.data) {
                setIsProcessUp(false)
                alert("Apollo API Automation Stopped!!!")
            }
        } catch (error: any) {
            alert("API Failed" + error.message);
        }
    }


    const processdetails = async () => {
        try {
            const response = await processDetail();
            if (response.data.processDetails) {
                let data = response.data.processDetails
                setProcessDetails(data)
            }
        } catch (error: any) {
            alert("API Failed" + error.message);
        }
    }

    useEffect(() => {
        checkprocess()
        console.log("Is Process Up", isProcessUp)
    }, [])

    return (
        <div className="container mt-5">
            <div>
                {!isProcessUp ? <button className="btn btn-success m-3" type="button" onClick={startprocess}>
                    Start the Process
                </button> :
                    <button className="btn btn-warning m-3" type="button" onClick={stopprocess}>
                        Stop the Process
                    </button>
                }
                <button className="btn btn-primary m-3" type="button" onClick={processdetails}>
                    Check the Process Details
                </button>
                {processDetails.lastUpdated && <div className="card mb-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Status:</strong>{" "}
                                <span className={processDetails.isRunning ? "text-success" : "text-danger"}>
                                    {processDetails.isRunning ? "Running" : "Stopped"}
                                </span>
                            </div>
                            <div className="col-md-4">
                                <strong>Total Fetched:</strong>{" "}
                                <span>{processDetails.fetchedToday}</span>
                            </div>
                            <div className="col-md-4">
                                <strong>Last Updated:</strong>{" "}
                                <span>{new Date(processDetails.lastUpdated).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>}

            </div>
            <div>
                <FileList />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Person Location</label>
                    <input
                        className="form-control"
                        name="person_locations"
                        value={form.person_locations}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Seniority</label>
                    <input
                        className="form-control"
                        name="person_seniorities"
                        value={form.person_seniorities}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Organization Location</label>
                    <input
                        className="form-control"
                        name="organization_locations"
                        value={form.organization_locations}
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <div className="col">
                        <label className="form-label">Page</label>
                        <input
                            type="number"
                            className="form-control"
                            name="page"
                            value={form.page}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Per Page</label>
                        <input
                            type="number"
                            className="form-control"
                            name="per_page"
                            value={form.per_page}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button className="btn btn-primary mt-3" type="submit">
                    Search & Download Excel
                </button>
            </form>
        </div>
    );
};

export default ApolloSearch;
