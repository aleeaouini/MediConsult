import { Container, Grid, Box, Typography, Paper, Button } from '@mui/material';
import { FaLaptop, FaBolt, FaGlobe, FaLock, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Tobba = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <FaLaptop />,
            title: "Description des symptômes simplifiée",
            description:
                "Décrivez vos symptômes en quelques étapes simples, sans avoir à vous déplacer.",
        },
        {
            icon: <FaBolt />,
            title: "Réponse rapide du médecin",
            description:
                "Recevez des réponses rapides de nos professionnels de santé qualifiés.",
        },
        {
            icon: <FaGlobe />,
            title: "Praticité et accessibilité",
            description:
                "Consultez un médecin à tout moment et de n'importe où via notre plateforme.",
        },
        {
            icon: <FaLock />,
            title: "Discrétion et confidentialité",
            description:
                "Vos informations de santé sont protégées et restent entièrement confidentielles.",
        },
        {
            icon: <FaLightbulb />,
            title: "Suivi médical personnalisé",
            description:
                "Recevez des conseils et actes médicaux adaptés à vos besoins spécifiques.",
        },
    ];

    return (
        <Container>
            <Box sx={{ textAlign: 'center', py: 15 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
                    MediConsult - consulter un médecin en ligne
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ color: '#1565c0' }}>
                    Pourquoi choisir MediConsult ?
                </Typography>
                <Typography variant="body1" paragraph>
                    Chez MediConsult, nous mettons la technologie au service de votre santé et de celle de vos proches. Profitez de solutions innovantes pour des consultations médicales rapides et accessibles, où que vous soyez.
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                        <img src="src/assets/tele.webp" alt="Téléconsultation médicale" style={{ width: '100px', marginRight: '16px' }} />
                        <Box>
                            <Typography variant="h6">Téléconsultation médicale</Typography>
                            <Typography variant="body2">
                                Consultez des <strong>médecins</strong> inscrits à l ordre des médecins : examen de votre dossier ; discussion par messages avec médecin ;
                                 récupérez votre traitement en ligne.
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                        <img src="src/assets/medi.webp" alt="SantéLyna" style={{ width: '100px', marginRight: '16px' }} />
                        <Box>
                            <Typography variant="h6">MediCare Info</Typography>
                            <Typography variant="body2">
                                Profitez d une banque d <strong>informations de santé</strong> simples mais très utiles, produites spécialement pour vous par des
                                médecins et des professionnels de la santé. Cultivez davantage vos <strong>connaissances sur le corps humain</strong>.
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ mt: 5 }}>
                {features.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderRadius: 2,
                                boxShadow: 3,
                                backgroundColor: '#ffffff',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: 15,
                                },
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                            <Box sx={{ fontSize: 50, color: '#1976d2', mb: 3 }}>
                                {item.icon}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2, color: '#333' }}>
                                {item.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#555', textAlign: 'center' }}>
                                {item.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        px: 4,
                        py: 2,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                            transform: 'scale(1.05)',
                        },
                    }}
                    onClick={() => navigate('/Consult')}
                >
                    Consulter un Médecin
                </Button>
            </Box>
        </Container>
    );
};

export default Tobba;
