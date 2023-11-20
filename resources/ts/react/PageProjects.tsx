import React, { useEffect, useState } from "react";
import {
    Button,
    CheckPicker,
    Col,
    Grid,
    Modal,
    Pagination,
    Row,
    Table,
} from "rsuite";
import { useProjects } from "./hooks/useProjects";
import { ProjectStatusNames } from "./helpers/Enums";
import HttpClient from "./helpers/HttpClient";
import PageWrapper from "./layout/PageWrapper";

const { Column, HeaderCell, Cell } = Table;

const PageProjects: React.FC = () => {
    const [page, setPage] = useState(1);
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState<IProject | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(false);
    const { projects, projectsTotal, projectsLoading, fetchProjects } =
        useProjects();

    useEffect(() => {
        fetchProjects(page, selectedStatuses);
    }, [page]);

    useEffect(() => {
        fetchProjects(page, selectedStatuses);
        setPage(1);
    }, [selectedStatuses]);

    return (
        <PageWrapper>
            <Grid>
                <Row>
                    <Col md={24}>
                        <h1 style={{ padding: "40px 0" }}>Projektek</h1>
                        <CheckPicker
                            data={ProjectStatusNames.map((value, index) => ({
                                label: value,
                                value: index,
                            }))}
                            style={{ width: "100%", marginBottom: 15 }}
                            placeholder="Szűrés státuszra..."
                            value={selectedStatuses}
                            onChange={(value) => setSelectedStatuses(value)}
                        />
                        <Table
                            autoHeight
                            data={projects}
                            loading={projectsLoading}
                        >
                            <Column width={200} flexGrow={1}>
                                <HeaderCell>Név</HeaderCell>
                                <Cell dataKey="name" />
                            </Column>
                            <Column width={100} flexGrow={1}>
                                <HeaderCell>Státusz</HeaderCell>
                                <Cell>
                                    {(row: any) => (
                                        <>
                                            {ProjectStatusNames[row.status] ??
                                                ""}
                                        </>
                                    )}
                                </Cell>
                            </Column>
                            <Column width={100} flexGrow={1}>
                                <HeaderCell>Kapcsolattartók száma</HeaderCell>
                                <Cell dataKey="contacts_count" />
                            </Column>
                            <Column width={200} flexGrow={1}>
                                <HeaderCell>Műveletek</HeaderCell>
                                <Cell>
                                    {(row: any) => (
                                        <>
                                            <Button
                                                appearance="link"
                                                size="xs"
                                                href={`/${row.id}`}
                                            >
                                                Szerkesztés
                                            </Button>
                                            <Button
                                                appearance="link"
                                                color="red"
                                                size="xs"
                                                onClick={() =>
                                                    setShowDeleteModal(row)
                                                }
                                            >
                                                Törlés
                                            </Button>
                                        </>
                                    )}
                                </Cell>
                            </Column>
                        </Table>
                        <div style={{ padding: 20 }}>
                            <Pagination
                                prev
                                next
                                first
                                last
                                ellipsis
                                boundaryLinks
                                maxButtons={5}
                                size="xs"
                                layout={["total", "-", "pager"]}
                                total={projectsTotal}
                                limit={10}
                                activePage={page}
                                onChangePage={setPage}
                            />
                        </div>
                    </Col>
                </Row>
            </Grid>

            <Modal
                open={showDeleteModal !== null}
                onClose={() => setShowDeleteModal(null)}
            >
                <Modal.Header>
                    <Modal.Title>Törlés</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Biztosan törölni szeretné ezt a projektet:{" "}
                    <b>{showDeleteModal?.name ?? "-"}</b>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            if (!showDeleteModal) {
                                return;
                            }
                            setLoading(true);
                            HttpClient({
                                url: `/api/project/${showDeleteModal.id}`,
                                method: "delete",
                            }).finally(() => {
                                setShowDeleteModal(null);
                                setLoading(false);
                                fetchProjects(page, selectedStatuses);

                                // Nem a legelegánsabb megoldás, de azért van hogy nehogy olyan oldalon maradjunk ahol már nincs is adat.
                                setPage(1);
                            });
                        }}
                        appearance="primary"
                        color="red"
                        loading={loading}
                    >
                        Törlés
                    </Button>
                    <Button
                        onClick={() => setShowDeleteModal(null)}
                        appearance="subtle"
                        loading={loading}
                    >
                        Mégse
                    </Button>
                </Modal.Footer>
            </Modal>
        </PageWrapper>
    );
};
export default PageProjects;
