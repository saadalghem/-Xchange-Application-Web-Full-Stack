package org.exemple.pfe_s.Repository;

import org.exemple.pfe_s.Entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    boolean existsByEmail(String email);

    Utilisateur findByEmail(String email);
}